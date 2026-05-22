using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Data;
using TaskManager.DTOs;
using TaskManager.Models;
using TaskManager.Services;

namespace TaskManager.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IJwtService _jwt;

    public AuthController(AppDbContext db, IJwtService jwt)
    {
        _db  = db;
        _jwt = jwt;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] SignupRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name) || string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { message = "Name, email and password are required." });

        if (await _db.Users.AnyAsync(u => u.Email == req.Email))
            return Conflict(new { message = "Email already in use." });

        if (!Enum.TryParse<UserRole>(req.Role, ignoreCase: true, out var role))
            role = UserRole.Member;

        var user = new User
        {
            Name         = req.Name,
            Email        = req.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Role         = role
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok(new AuthResponse(_jwt.GenerateToken(user), user.Name, user.Email, user.Role.ToString()));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { message = "Email and password are required." });

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email.ToLower());
        if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid credentials." });

        return Ok(new AuthResponse(_jwt.GenerateToken(user), user.Name, user.Email, user.Role.ToString()));
    }
}
