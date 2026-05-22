using Microsoft.EntityFrameworkCore;
using TaskManager.Models;
using TaskStatus = TaskManager.Models.TaskStatus;

namespace TaskManager.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectMember> ProjectMembers => Set<ProjectMember>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // User
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<User>()
            .Property(u => u.Role).HasConversion<string>();

        // Project
        modelBuilder.Entity<Project>()
            .HasOne(p => p.CreatedBy)
            .WithMany(u => u.CreatedProjects)
            .HasForeignKey(p => p.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);

        // ProjectMember unique constraint
        modelBuilder.Entity<ProjectMember>()
            .HasIndex(pm => new { pm.ProjectId, pm.UserId }).IsUnique();

        // Task
        modelBuilder.Entity<TaskItem>()
            .Property(t => t.Status).HasConversion<string>();
        modelBuilder.Entity<TaskItem>()
            .Property(t => t.Priority).HasConversion<string>();
        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.AssignedTo)
            .WithMany(u => u.AssignedTasks)
            .HasForeignKey(t => t.AssignedToId)
            .OnDelete(DeleteBehavior.SetNull);

        // Seed data
        var adminPasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123");
        var member1Hash = BCrypt.Net.BCrypt.HashPassword("Member@123");
        var member2Hash = BCrypt.Net.BCrypt.HashPassword("Member@123");

        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Name = "Admin User",   Email = "admin@ethara.ai",   PasswordHash = adminPasswordHash,  Role = UserRole.Admin,  CreatedAt = new DateTime(2025,1,1,0,0,0,DateTimeKind.Utc) },
            new User { Id = 2, Name = "Alice Member", Email = "alice@ethara.ai",   PasswordHash = member1Hash,        Role = UserRole.Member, CreatedAt = new DateTime(2025,1,1,0,0,0,DateTimeKind.Utc) },
            new User { Id = 3, Name = "Bob Member",   Email = "bob@ethara.ai",     PasswordHash = member2Hash,        Role = UserRole.Member, CreatedAt = new DateTime(2025,1,1,0,0,0,DateTimeKind.Utc) }
        );

        modelBuilder.Entity<Project>().HasData(
            new Project { Id = 1, Name = "LLM Data Pipeline", Description = "Post-training data curation for LLMs", CreatedById = 1, CreatedAt = new DateTime(2025,1,1,0,0,0,DateTimeKind.Utc) }
        );

        modelBuilder.Entity<ProjectMember>().HasData(
            new ProjectMember { Id = 1, ProjectId = 1, UserId = 1, JoinedAt = new DateTime(2025,1,1,0,0,0,DateTimeKind.Utc) },
            new ProjectMember { Id = 2, ProjectId = 1, UserId = 2, JoinedAt = new DateTime(2025,1,1,0,0,0,DateTimeKind.Utc) },
            new ProjectMember { Id = 3, ProjectId = 1, UserId = 3, JoinedAt = new DateTime(2025,1,1,0,0,0,DateTimeKind.Utc) }
        );

        modelBuilder.Entity<TaskItem>().HasData(
            new TaskItem { Id = 1, Title = "Collect training prompts", Description = "Gather 1000 domain-specific prompts", Status = TaskStatus.Done,       Priority = TaskPriority.Medium, DueDate = new DateTime(2025,2,1,0,0,0,DateTimeKind.Utc),  ProjectId = 1, AssignedToId = 2, CreatedAt = new DateTime(2025,1,5,0,0,0,DateTimeKind.Utc) },
            new TaskItem { Id = 2, Title = "Human feedback loop",      Description = "Review and rate model responses",       Status = TaskStatus.InProgress, Priority = TaskPriority.High,   DueDate = new DateTime(2025,6,1,0,0,0,DateTimeKind.Utc),  ProjectId = 1, AssignedToId = 3, CreatedAt = new DateTime(2025,1,10,0,0,0,DateTimeKind.Utc) },
            new TaskItem { Id = 3, Title = "Evaluation framework",     Description = "Build eval metrics dashboard",          Status = TaskStatus.Todo,       Priority = TaskPriority.Low,    DueDate = new DateTime(2024,12,1,0,0,0,DateTimeKind.Utc), ProjectId = 1, AssignedToId = 2, CreatedAt = new DateTime(2025,1,15,0,0,0,DateTimeKind.Utc) }
        );
    }
}
