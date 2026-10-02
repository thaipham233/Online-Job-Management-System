using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Dapper;
using Dapper.Contrib.Extensions;
using System.Data;
using System.Security.Claims;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Repositories
{
    public class DapperRoleStore : 
        IRoleStore<IdentityRole<int>>,
        IRoleClaimStore<IdentityRole<int>>
    {
        private readonly string _connectionString;

        public DapperRoleStore(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? throw new ArgumentNullException("Connection string not found");
        }

        private IDbConnection CreateConnection() => new SqlConnection(_connectionString);

        public async Task<IdentityResult> CreateAsync(IdentityRole<int> role, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            role.ConcurrencyStamp = Guid.NewGuid().ToString();
            
            var sql = @"
                INSERT INTO Roles (Name, NormalizedName, ConcurrencyStamp)
                VALUES (@Name, @NormalizedName, @ConcurrencyStamp);
                SELECT CAST(SCOPE_IDENTITY() as int)";
            
            var id = await connection.QuerySingleAsync<int>(sql, role);
            role.Id = id;
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> UpdateAsync(IdentityRole<int> role, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            role.ConcurrencyStamp = Guid.NewGuid().ToString();
            
            var sql = @"
                UPDATE Roles SET 
                    Name = @Name, NormalizedName = @NormalizedName, ConcurrencyStamp = @ConcurrencyStamp
                WHERE Id = @Id";
            
            await connection.ExecuteAsync(sql, role);
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteAsync(IdentityRole<int> role, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            await connection.ExecuteAsync("DELETE FROM Roles WHERE Id = @Id", new { role.Id });
            return IdentityResult.Success;
        }

        public async Task<IdentityRole<int>?> FindByIdAsync(string roleId, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<IdentityRole<int>>(
                "SELECT * FROM Roles WHERE Id = @Id", new { Id = int.Parse(roleId) });
        }

        public async Task<IdentityRole<int>?> FindByNameAsync(string normalizedRoleName, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<IdentityRole<int>>(
                "SELECT * FROM Roles WHERE NormalizedName = @NormalizedName", 
                new { NormalizedName = normalizedRoleName });
        }

        public Task<string> GetRoleIdAsync(IdentityRole<int> role, CancellationToken cancellationToken)
            => Task.FromResult(role.Id.ToString());

        public Task<string> GetRoleNameAsync(IdentityRole<int> role, CancellationToken cancellationToken)
            => Task.FromResult(role.Name);

        public Task SetRoleNameAsync(IdentityRole<int> role, string? roleName, CancellationToken cancellationToken)
        {
            role.Name = roleName;
            role.NormalizedName = roleName?.ToUpperInvariant();
            return Task.CompletedTask;
        }

        public Task<string> GetNormalizedRoleNameAsync(IdentityRole<int> role, CancellationToken cancellationToken)
            => Task.FromResult(role.NormalizedName);

        public Task SetNormalizedRoleNameAsync(IdentityRole<int> role, string? normalizedName, CancellationToken cancellationToken)
        {
            role.NormalizedName = normalizedName;
            return Task.CompletedTask;
        }

        // IRoleClaimStore
        public async Task<IList<Claim>> GetClaimsAsync(IdentityRole<int> role, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            var claims = await connection.QueryAsync<RoleClaim>(
                "SELECT * FROM RoleClaims WHERE RoleId = @RoleId", new { RoleId = role.Id });
            return claims.Select(c => c.ToClaim()).ToList();
        }

        public Task AddClaimAsync(IdentityRole<int> role, Claim claim, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            var sql = "INSERT INTO RoleClaims (RoleId, ClaimType, ClaimValue) VALUES (@RoleId, @ClaimType, @ClaimValue)";
            connection.Execute(sql, new { RoleId = role.Id, ClaimType = claim.Type, ClaimValue = claim.Value });
            return Task.CompletedTask;
        }

        public Task RemoveClaimAsync(IdentityRole<int> role, Claim claim, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            connection.Execute(
                "DELETE FROM RoleClaims WHERE RoleId = @RoleId AND ClaimType = @ClaimType AND ClaimValue = @ClaimValue",
                new { RoleId = role.Id, ClaimType = claim.Type, ClaimValue = claim.Value });
            return Task.CompletedTask;
        }

        public void Dispose() { }
    }

    [Table("RoleClaims")]
    public class RoleClaim
    {
        [ExplicitKey]
        public int Id { get; set; }
        public int RoleId { get; set; }
        public string ClaimType { get; set; } = string.Empty;
        public string ClaimValue { get; set; } = string.Empty;

        public Claim ToClaim() => new Claim(ClaimType, ClaimValue);
    }
}
