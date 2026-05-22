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
[Authorize]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _db;
    public TasksController(AppDbContext db) => _db = db;

    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private string CurrentUserRole =>
        User.FindFirstValue(ClaimTypes.Role)!;

    // GET /api/projects/:projectId/tasks
    [HttpGet("api/projects/{projectId}/tasks")]
    public async Task<IActionResult> GetTasks(int projectId)
    {
        if (!await IsMemberOf(projectId)) return Forbid();

        var tasks = await _db.Tasks
            .Include(t => t.AssignedTo)
            .Where(t => t.ProjectId == projectId)
            .OrderBy(t => t.DueDate)
            .ToListAsync();

        return Ok(tasks.Select(ToDto));
    }

    // POST /api/projects/:projectId/tasks
    [HttpPost("api/projects/{projectId}/tasks")]
    public async Task<IActionResult> CreateTask(int projectId, [FromBody] CreateTaskRequest req)
    {
        if (!await IsMemberOf(projectId)) return Forbid();

        if (string.IsNullOrWhiteSpace(req.Title))
            return BadRequest(new { message = "Title is required." });

        if (req.AssignedToId.HasValue)
        {
            var isProjectMember = await _db.ProjectMembers
                .AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == req.AssignedToId.Value);
            if (!isProjectMember)
                return BadRequest(new { message = "Assigned user is not a project member." });
        }

        Enum.TryParse<TaskPriority>(req.Priority, ignoreCase: true, out var priority);
        var task = new TaskItem
        {
            Title        = req.Title,
            Description  = req.Description,
            ProjectId    = projectId,
            AssignedToId = req.AssignedToId,
            DueDate      = req.DueDate,
            Status       = TaskStatus.Todo,
            Priority     = priority
        };

        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();
        await _db.Entry(task).Reference(t => t.AssignedTo).LoadAsync();

        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, ToDto(task));
    }

    // GET /api/tasks/:id
    [HttpGet("api/tasks/{id}")]
    public async Task<IActionResult> GetTask(int id)
    {
        var task = await _db.Tasks.Include(t => t.AssignedTo).FirstOrDefaultAsync(t => t.Id == id);
        if (task == null) return NotFound(new { message = "Task not found." });
        if (!await IsMemberOf(task.ProjectId)) return Forbid();
        return Ok(ToDto(task));
    }

    // PATCH /api/tasks/:id
    [HttpPatch("api/tasks/{id}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskRequest req)
    {
        var task = await _db.Tasks.Include(t => t.AssignedTo).FirstOrDefaultAsync(t => t.Id == id);
        if (task == null) return NotFound(new { message = "Task not found." });
        if (!await IsMemberOf(task.ProjectId)) return Forbid();

        // Members can only update status on tasks assigned to them
        if (CurrentUserRole == "Member" && task.AssignedToId != CurrentUserId)
            return Forbid();

        if (!string.IsNullOrEmpty(req.Status))
        {
            if (!Enum.TryParse<TaskStatus>(req.Status, ignoreCase: true, out var newStatus))
                return BadRequest(new { message = "Invalid status. Use: Todo, InProgress, Done" });
            task.Status = newStatus;
        }

        // Admins can also update other fields
        if (CurrentUserRole == "Admin")
        {
            if (!string.IsNullOrEmpty(req.Title))       task.Title       = req.Title;
            if (!string.IsNullOrEmpty(req.Description)) task.Description = req.Description;
            if (req.AssignedToId.HasValue)               task.AssignedToId = req.AssignedToId;
            if (req.DueDate.HasValue)                    task.DueDate     = req.DueDate;
            if (!string.IsNullOrEmpty(req.Priority))
            {
                if (Enum.TryParse<TaskPriority>(req.Priority, ignoreCase: true, out var parsedPriority))
                    task.Priority = parsedPriority;
            }
        }

        await _db.SaveChangesAsync();
        await _db.Entry(task).Reference(t => t.AssignedTo).LoadAsync();
        return Ok(ToDto(task));
    }

    // DELETE /api/tasks/:id  (Admin only)
    [HttpDelete("api/tasks/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task == null) return NotFound(new { message = "Task not found." });

        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Task deleted." });
    }

    private async Task<bool> IsMemberOf(int projectId) =>
        await _db.ProjectMembers.AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == CurrentUserId);

    private static TaskDto ToDto(TaskItem t) => new(
        t.Id, t.Title, t.Description, t.Status.ToString(), t.DueDate,
        t.AssignedTo == null ? null : new UserDto(t.AssignedTo.Id, t.AssignedTo.Name, t.AssignedTo.Email, t.AssignedTo.Role.ToString()),
        t.ProjectId, t.CreatedAt, t.Priority.ToString()
    );
}
