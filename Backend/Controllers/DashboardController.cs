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
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;
    public DashboardController(AppDbContext db) => _db = db;

    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private string CurrentUserRole =>
        User.FindFirstValue(ClaimTypes.Role)!;

    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
        var userId = CurrentUserId;
        var isAdmin = CurrentUserRole == "Admin";

        // Get project IDs the user belongs to
        var projectIds = await _db.ProjectMembers
            .Where(pm => pm.UserId == userId)
            .Select(pm => pm.ProjectId)
            .ToListAsync();

        IQueryable<TaskItem> query = _db.Tasks
            .Include(t => t.AssignedTo)
            .Where(t => projectIds.Contains(t.ProjectId));

        // Members only see their assigned tasks
        if (!isAdmin)
            query = query.Where(t => t.AssignedToId == userId);

        var allTasks = await query.ToListAsync();
        var now = DateTime.UtcNow;

        var overdueTasks = allTasks
            .Where(t => t.DueDate < now && t.Status != TaskStatus.Done)
            .ToList();

        static TaskDto Map(TaskItem t) => new(
            t.Id, t.Title, t.Description, t.Status.ToString(), t.DueDate,
            t.AssignedTo == null ? null : new UserDto(t.AssignedTo.Id, t.AssignedTo.Name, t.AssignedTo.Email, t.AssignedTo.Role.ToString()),
            t.ProjectId, t.CreatedAt, t.Priority.ToString()
        );

        return Ok(new DashboardDto(
            TotalTasks:      allTasks.Count,
            TodoCount:       allTasks.Count(t => t.Status == TaskStatus.Todo),
            InProgressCount: allTasks.Count(t => t.Status == TaskStatus.InProgress),
            DoneCount:       allTasks.Count(t => t.Status == TaskStatus.Done),
            OverdueCount:    overdueTasks.Count,
            OverdueTasks:    overdueTasks.Select(Map).ToList()
        ));
    }
}
