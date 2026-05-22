using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Data;
using TaskManager.DTOs;
using TaskManager.Models;
using TaskStatus = TaskManager.Models.TaskStatus;

namespace TaskManager.Controllers;

[ApiController]
[Route("api/projects")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProjectsController(AppDbContext db) => _db = db;

    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private string CurrentUserRole =>
        User.FindFirstValue(ClaimTypes.Role)!;

    // GET /api/projects
    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        var userId = CurrentUserId;

        var projects = await _db.Projects
            .Include(p => p.CreatedBy)
            .Include(p => p.Members).ThenInclude(m => m.User)
            .Include(p => p.Tasks)
            .Where(p => p.Members.Any(m => m.UserId == userId))
            .ToListAsync();

        return Ok(projects.Select(ToDto));
    }

    // POST /api/projects  (Admin only)
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name))
            return BadRequest(new { message = "Project name is required." });

        var project = new Project
        {
            Name        = req.Name,
            Description = req.Description,
            CreatedById = CurrentUserId
        };

        _db.Projects.Add(project);
        await _db.SaveChangesAsync();

        // Auto-add creator as member
        _db.ProjectMembers.Add(new ProjectMember { ProjectId = project.Id, UserId = CurrentUserId });
        await _db.SaveChangesAsync();

        await _db.Entry(project).Reference(p => p.CreatedBy).LoadAsync();
        await _db.Entry(project).Collection(p => p.Members).Query().Include(m => m.User).LoadAsync();

        return CreatedAtAction(nameof(GetProject), new { id = project.Id }, ToDto(project));
    }

    // GET /api/projects/:id
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProject(int id)
    {
        var project = await _db.Projects
            .Include(p => p.CreatedBy)
            .Include(p => p.Members).ThenInclude(m => m.User)
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null) return NotFound(new { message = "Project not found." });
        if (!IsMember(project)) return Forbid();

        return Ok(ToDto(project));
    }

    // POST /api/projects/:id/members  (Admin only)
    [HttpPost("{id}/members")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddMember(int id, [FromBody] AddMemberRequest req)
    {
        var project = await _db.Projects.Include(p => p.Members).FirstOrDefaultAsync(p => p.Id == id);
        if (project == null) return NotFound(new { message = "Project not found." });

        if (project.Members.Any(m => m.UserId == req.UserId))
            return Conflict(new { message = "User is already a member." });

        var user = await _db.Users.FindAsync(req.UserId);
        if (user == null) return NotFound(new { message = "User not found." });

        _db.ProjectMembers.Add(new ProjectMember { ProjectId = id, UserId = req.UserId });
        await _db.SaveChangesAsync();

        return Ok(new { message = "Member added." });
    }

    // DELETE /api/projects/:id  (Admin only)
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var project = await _db.Projects.FindAsync(id);
        if (project == null) return NotFound(new { message = "Project not found." });

        _db.Projects.Remove(project);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Project deleted." });
    }

    private bool IsMember(Project p) =>
        p.Members.Any(m => m.UserId == CurrentUserId);

    private static ProjectDto ToDto(Project p) => new(
        p.Id, p.Name, p.Description,
        new UserDto(p.CreatedBy.Id, p.CreatedBy.Name, p.CreatedBy.Email, p.CreatedBy.Role.ToString()),
        p.CreatedAt,
        p.Members.Select(m => new UserDto(m.User.Id, m.User.Name, m.User.Email, m.User.Role.ToString())).ToList(),
        p.Tasks.Count,
        p.Tasks.Count(t => t.Status == TaskStatus.Done)
    );
}
