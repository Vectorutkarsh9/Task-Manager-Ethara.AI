namespace TaskManager.DTOs;

// ── Auth ──────────────────────────────────────────────
public record SignupRequest(string Name, string Email, string Password, string Role = "Member");
public record LoginRequest(string Email, string Password);
public record AuthResponse(string Token, string Name, string Email, string Role);

// ── User ──────────────────────────────────────────────
public record UserDto(int Id, string Name, string Email, string Role);

// ── Project ───────────────────────────────────────────
public record CreateProjectRequest(string Name, string Description);
public record AddMemberRequest(int UserId);

public record ProjectDto(
    int Id,
    string Name,
    string Description,
    UserDto CreatedBy,
    DateTime CreatedAt,
    List<UserDto> Members,
    int TotalTasks = 0,
    int CompletedTasks = 0
);

// ── Task ──────────────────────────────────────────────
public record CreateTaskRequest(
    string Title,
    string Description,
    int? AssignedToId,
    DateTime? DueDate,
    string? Priority = "Medium"
);

public record UpdateTaskRequest(
    string? Status,
    string? Title,
    string? Description,
    int? AssignedToId,
    DateTime? DueDate,
    string? Priority
);

public record TaskDto(
    int Id,
    string Title,
    string Description,
    string Status,
    DateTime? DueDate,
    UserDto? AssignedTo,
    int ProjectId,
    DateTime CreatedAt,
    string Priority
);

// ── Dashboard ─────────────────────────────────────────
public record DashboardDto(
    int TotalTasks,
    int TodoCount,
    int InProgressCount,
    int DoneCount,
    int OverdueCount,
    List<TaskDto> OverdueTasks
);
