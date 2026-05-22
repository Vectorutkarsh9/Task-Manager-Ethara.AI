using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TaskManager.Data;
using TaskManager.Services;

var builder = WebApplication.CreateBuilder(args);

// ── DB ─────────────────────────────────────────────────────────────
// Hardcoded fallback (overridden by appsettings.json or DATABASE_URL env)
const string LocalFallbackConnStr = "Host=localhost;Port=5432;Database=taskmanager;Username=postgres;Password=root";
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    connectionString = LocalFallbackConnStr;
    Console.WriteLine("INFO: appsettings.json DefaultConnection not found — using hardcoded fallback.");
}

var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
Console.WriteLine("INFO: Initializing database connection...");
if (!string.IsNullOrEmpty(databaseUrl))
{
    try
    {
        if (databaseUrl.StartsWith("postgres://") || databaseUrl.StartsWith("postgresql://"))
        {
            var uri = new Uri(databaseUrl);
            var userInfo = uri.UserInfo.Split(':');
            var username = userInfo[0];
            var password = userInfo.Length > 1 ? userInfo[1] : "";
            var host = uri.Host;
            var port = uri.Port == -1 ? 5432 : uri.Port;
            var database = uri.AbsolutePath.TrimStart('/');
            if (string.IsNullOrEmpty(host))
                throw new ArgumentException("Host in DATABASE_URL is empty");
            connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password};SslMode=Prefer;Trust Server Certificate=true";
            Console.WriteLine("INFO: Using DATABASE_URL (parsed postgres URI).");
        }
        else if (databaseUrl.Contains("Host=") || databaseUrl.Contains("Server=") || databaseUrl.Contains("host="))
        {
            connectionString = databaseUrl;
            Console.WriteLine("INFO: Using DATABASE_URL as direct connection string.");
        }
        else
        {
            Console.WriteLine($"WARNING: DATABASE_URL set but unrecognised format — ignoring, using appsettings/fallback.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"ERROR parsing DATABASE_URL: {ex.Message}. Using appsettings/fallback.");
    }
}
else
{
    Console.WriteLine("INFO: DATABASE_URL not set — using appsettings/fallback connection string.");
}

Console.WriteLine($"INFO: Final connection host: {(connectionString?.Contains("Host=") == true ? connectionString.Split(';').FirstOrDefault(s => s.StartsWith("Host=")) : "[unknown]")}");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// ── Auth ───────────────────────────────────────────────────────────
var jwtSecret = builder.Configuration["Jwt:Secret"]
    ?? throw new InvalidOperationException("Jwt:Secret not configured");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = builder.Configuration["Jwt:Issuer"],
            ValidAudience            = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<IJwtService, JwtService>();

// ── CORS ───────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                builder.Configuration["AllowedOrigins"] ?? "http://localhost:5173",
                "https://*.vercel.app"
              )
              .SetIsOriginAllowedToAllowWildcardSubdomains()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ── Controllers + Swagger ──────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "TaskManager API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name         = "Authorization",
        Type         = SecuritySchemeType.Http,
        Scheme       = "bearer",
        BearerFormat = "JWT",
        In           = ParameterLocation.Header,
        Description  = "Enter your JWT token (without 'Bearer' prefix)"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ── Migrate & Seed on startup ──────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// ── Middleware Pipeline ────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
