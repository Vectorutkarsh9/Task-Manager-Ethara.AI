using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TaskManager.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    CreatedById = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Projects_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProjectMembers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProjectId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    JoinedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectMembers_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectMembers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tasks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Priority = table.Column<string>(type: "text", nullable: false),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProjectId = table.Column<int>(type: "integer", nullable: false),
                    AssignedToId = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tasks_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Tasks_Users_AssignedToId",
                        column: x => x.AssignedToId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "Name", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@ethara.ai", "Admin User", "$2a$11$tR7GqJSYf34fm/fiZwELlu58wlAdPYNOJ2hwzYJhRAtKUYXpKrtX2", "Admin" },
                    { 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "alice@ethara.ai", "Alice Member", "$2a$11$3L7aIOtQaoBmyOrHFVH8UOx9NP9Or2QHRBDix5.JSUpGIVwQFHehC", "Member" },
                    { 3, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "bob@ethara.ai", "Bob Member", "$2a$11$R8kScm/D1nVcGJLNwOvun.dZd/JQ5NcMqzhCiss.RhZOGpOm84.X2", "Member" }
                });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "Id", "CreatedAt", "CreatedById", "Description", "Name" },
                values: new object[] { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "Post-training data curation for LLMs", "LLM Data Pipeline" });

            migrationBuilder.InsertData(
                table: "ProjectMembers",
                columns: new[] { "Id", "JoinedAt", "ProjectId", "UserId" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, 1 },
                    { 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, 2 },
                    { 3, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, 3 }
                });

            migrationBuilder.InsertData(
                table: "Tasks",
                columns: new[] { "Id", "AssignedToId", "CreatedAt", "Description", "DueDate", "Priority", "ProjectId", "Status", "Title" },
                values: new object[,]
                {
                    { 1, 2, new DateTime(2025, 1, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Gather 1000 domain-specific prompts", new DateTime(2025, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Medium", 1, "Done", "Collect training prompts" },
                    { 2, 3, new DateTime(2025, 1, 10, 0, 0, 0, 0, DateTimeKind.Utc), "Review and rate model responses", new DateTime(2025, 6, 1, 0, 0, 0, 0, DateTimeKind.Utc), "High", 1, "InProgress", "Human feedback loop" },
                    { 3, 2, new DateTime(2025, 1, 15, 0, 0, 0, 0, DateTimeKind.Utc), "Build eval metrics dashboard", new DateTime(2024, 12, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Low", 1, "Todo", "Evaluation framework" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMembers_ProjectId_UserId",
                table: "ProjectMembers",
                columns: new[] { "ProjectId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMembers_UserId",
                table: "ProjectMembers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_CreatedById",
                table: "Projects",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_AssignedToId",
                table: "Tasks",
                column: "AssignedToId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ProjectId",
                table: "Tasks",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectMembers");

            migrationBuilder.DropTable(
                name: "Tasks");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
