using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TileSystem2.Models;

namespace TileSystem2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;

        public AuthController(IConfiguration config)
        {
            _config = config;
        }

        private IDbConnection Connection => new MySqlConnection(_config.GetConnectionString("ProductAppCon"));

        [HttpPost("login")]
        public IActionResult Login([FromBody] users login)
        {
            try
            {
                string query = "SELECT username, password FROM users WHERE username = @username AND password = @password";

                using var connection = Connection;
                connection.Open(); // <- LINE 33 ERROR

                Console.WriteLine("✅ Connected to DB"); // For debug

                var user = connection.QueryFirstOrDefault<users>(
                    query,
                    new { username = login.username, password = login.password }
                );

                if (user == null)
                    return Unauthorized("❌ Invalid username or password");

                var token = GenerateJwtToken(user.username);
                return Ok(new { token });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"❌ Exception: {ex.Message}\n\n{ex.StackTrace}");
            }
        }

        private string GenerateJwtToken(string username)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
