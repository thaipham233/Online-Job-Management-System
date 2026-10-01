using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Dapper;
using System.Data;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Repositories
{
    public class DapperUserStore : 
        IUserStore<User>,
        IUserPasswordStore<User>,
        IUserEmailStore<User>,
        IUserPhoneNumberStore<User>,
        IUserLockoutStore<User>,
        IUserTwoFactorStore<User>,
        IUserClaimStore<User>,
        IUserLoginStore<User>,
        IUserRoleStore<User>,
        IUserSecurityStampStore<User>,
        IUserAuthenticatorKeyStore<User>,
        IUserTwoFactorRecoveryCodeStore<User>
    {
        private readonly string _connectionString;

        public DapperUserStore(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? throw new ArgumentNullException("Connection string not found");
        }

        private IDbConnection CreateConnection() => new SqlConnection(_connectionString);

        public async Task<IdentityResult> CreateAsync(User user, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            user.ConcurrencyStamp = Guid.NewGuid().ToString();
            user.SecurityStamp = Guid.NewGuid().ToString();
            
            var sql = @"
                INSERT INTO Users (UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, 
                    PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumber, PhoneNumberConfirmed, 
                    TwoFactorEnabled, LockoutEnd, LockoutEnabled, AccessFailedCount, 
                    FullName, AvatarUrl, CreatedAt, UpdatedAt, IsActive)
                VALUES (@UserName, @NormalizedUserName, @Email, @NormalizedEmail, @EmailConfirmed, 
                    @PasswordHash, @SecurityStamp, @ConcurrencyStamp, @PhoneNumber, @PhoneNumberConfirmed, 
                    @TwoFactorEnabled, @LockoutEnd, @LockoutEnabled, @AccessFailedCount, 
                    @FullName, @AvatarUrl, @CreatedAt, @UpdatedAt, @IsActive);
                SELECT CAST(SCOPE_IDENTITY() as int)";
            
            var id = await connection.QuerySingleAsync<int>(sql, user);
            user.Id = id;
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> UpdateAsync(User user, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            user.ConcurrencyStamp = Guid.NewGuid().ToString();
            
            var sql = @"
                UPDATE Users SET 
                    UserName = @UserName, NormalizedUserName = @NormalizedUserName,
                    Email = @Email, NormalizedEmail = @NormalizedEmail, EmailConfirmed = @EmailConfirmed,
                    PasswordHash = @PasswordHash, SecurityStamp = @SecurityStamp, ConcurrencyStamp = @ConcurrencyStamp,
                    PhoneNumber = @PhoneNumber, PhoneNumberConfirmed = @PhoneNumberConfirmed,
                    TwoFactorEnabled = @TwoFactorEnabled, LockoutEnd = @LockoutEnd, LockoutEnabled = @LockoutEnabled,
                    AccessFailedCount = @AccessFailedCount, FullName = @FullName, AvatarUrl = @AvatarUrl,
                    UpdatedAt = @UpdatedAt, IsActive = @IsActive
                WHERE Id = @Id";
            
            await connection.ExecuteAsync(sql, user);
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteAsync(User user, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            await connection.ExecuteAsync("DELETE FROM Users WHERE Id = @Id", new { user.Id });
            return IdentityResult.Success;
        }

        public async Task<User?> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM Users WHERE Id = @Id", new { Id = int.Parse(userId) });
        }

        public async Task<User?> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM Users WHERE NormalizedUserName = @NormalizedUserName", 
                new { NormalizedUserName = normalizedUserName });
        }

        public Task<string?> GetUserIdAsync(User user, CancellationToken cancellationToken)
            => Task.FromResult(user.Id.ToString());

        public Task<string?> GetUserNameAsync(User user, CancellationToken cancellationToken)
            => Task.FromResult(user.UserName);

        public Task SetUserNameAsync(User user, string? userName, CancellationToken cancellationToken)
        {
            user.UserName = userName;
            user.NormalizedUserName = userName?.ToUpperInvariant();
            return Task.CompletedTask;
        }

        public Task<string?> GetNormalizedUserNameAsync(User user, CancellationToken cancellationToken)
            => Task.FromResult(user.NormalizedUserName);

        public Task SetNormalizedUserNameAsync(User user, string? normalizedName, CancellationToken cancellationToken)
        {
            user.NormalizedUserName = normalizedName;
            return Task.CompletedTask;
        }

        public async Task SetEmailAsync(User user, string? email, CancellationToken cancellationToken)
        {
            user.Email = email;
            user.NormalizedEmail = email?.ToUpperInvariant();
        }

        public Task<string?> GetEmailAsync(User user, CancellationToken cancellationToken)
            => Task.FromResult(user.Email);

        public Task<bool> GetEmailConfirmedAsync(User user, CancellationToken cancellationToken)
            => Task.FromResult(user.EmailConfirmed);

        public Task SetEmailConfirmedAsync(User user, bool confirmed, CancellationToken cancellationToken)
        {
            user.EmailConfirmed = confirmed;
            return Task.CompletedTask;
        }

        public async Task<User?> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM Users WHERE NormalizedEmail = @NormalizedEmail", 
                new { NormalizedEmail = normalizedEmail });
        }

        public Task<string?> GetNormalizedEmailAsync(User user, CancellationToken cancellationToken)
            => Task.FromResult(user.NormalizedEmail);

        public Task SetNormalizedEmailAsync(User user, string? normalizedEmail, CancellationToken cancellationToken)
        {
            user.NormalizedEmail = normalizedEmail;
            return Task.CompletedTask;
        }

        public Task SetPhoneNumberAsync(User user, string? phoneNumber, CancellationToken cancellationToken)
        {
            user.PhoneNumber = phoneNumber;
            return Task.CompletedTask;
        }

        public Task<string?> GetPhoneNumberAsync(User user, CancellationToken cancellationToken)
            => Task.FromResult(user.PhoneNumber);

        public Task<bool> GetPhoneNumberConfirmedAsync(User user, CancellationToken cancellationToken)
            => Task.FromResult(user.PhoneNumberConfirmed);

        public Task SetPhoneNumberConfirmedAsync(User user, bool confirmed, CancellationToken cancellationToken)
        {
            user.PhoneNumberConfirmed = confirmed;
            return Task.CompletedTask;
        }

        public Task<DateTimeOffset?> GetLockoutEndDateAsync(User user, CancellationToken cancellationToken)
            => Task.FromResult(user.LockoutEnd);

        public Task SetLockoutEndDateAsync(User user, DateTimeOffset? lockoutEnd, CancellationToken cancellationToken)
        {
            user.LockoutEnd = lockoutEnd;
            return Task.CompletedTask;
        }

        public Task<int> IncrementAccessFailedCountAsync(User user, CancellationToken cancellationToken)
        {
            user.AccessFailedCount++;
            return Task.FromResult(user.AccessFailedCount);
        }

        public Task ResetAccessFailedCountAsync(User user, CancellationToken cancellationToken)
        {
            user.AccessFailedCount = 0;
            return Task.CompletedTask;
        }

        public Task<int> GetAccessFailedCountAsync(User user, CancellationToken cancellationToken)
            => Task.FromResult(user.AccessFailedCount);

        public Task<bool> GetLockoutEnabledAsync(User user, CancellationToken cancellationToken)
            => Task.FromResult(user.LockoutEnabled);

        public Task SetLockoutEnabledAsync(User user, bool enabled, CancellationToken cancellationToken)
        {
            user.LockoutEnabled = enabled;
            return Task.CompletedTask;
        }

        public Task SetTwoFactorEnabledAsync(User user, bool enabled, CancellationToken cancellationToken)
        {
            user.TwoFactorEnabled = enabled;
            return Task.CompletedTask;
        }

        public Task<bool> GetTwoFactorEnabledAsync(User user, CancellationToken cancellationToken)
            => Task.FromResult(user.TwoFactorEnabled);

        public Task SetPasswordHashAsync(User user, string? passwordHash, CancellationToken cancellationToken)
        {
            user.PasswordHash = passwordHash;
            return Task.CompletedTask;
        }

        public Task<string?> GetPasswordHashAsync(User user, CancellationToken cancellationToken)
            => Task.FromResult(user.PasswordHash);

        public Task<bool> HasPasswordAsync(User user, CancellationToken cancellationToken)
            => Task.FromResult(!string.IsNullOrEmpty(user.PasswordHash));

        // IUserClaimStore
        public Task<IList<Claim>> GetClaimsAsync(User user, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            var claims = await connection.QueryAsync<UserClaim>(
                "SELECT * FROM UserClaims WHERE UserId = @UserId", new { UserId = user.Id });
            return Task.FromResult<IList<Claim>>(claims.Select(c => c.ToClaim()).ToList());
        }

        public Task AddClaimsAsync(User user, IEnumerable<Claim> claims, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            var sql = "INSERT INTO UserClaims (UserId, ClaimType, ClaimValue) VALUES (@UserId, @ClaimType, @ClaimValue)";
            foreach (var claim in claims)
            {
                connection.Execute(sql, new { UserId = user.Id, ClaimType = claim.Type, ClaimValue = claim.Value });
            }
            return Task.CompletedTask;
        }

        public Task ReplaceClaimAsync(User user, Claim claim, Claim newClaim, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            connection.Execute(
                "DELETE FROM UserClaims WHERE UserId = @UserId AND ClaimType = @ClaimType AND ClaimValue = @ClaimValue",
                new { UserId = user.Id, ClaimType = claim.Type, ClaimValue = claim.Value });
            connection.Execute(
                "INSERT INTO UserClaims (UserId, ClaimType, ClaimValue) VALUES (@UserId, @ClaimType, @ClaimValue)",
                new { UserId = user.Id, ClaimType = newClaim.Type, ClaimValue = newClaim.Value });
            return Task.CompletedTask;
        }

        public Task RemoveClaimsAsync(User user, IEnumerable<Claim> claims, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            foreach (var claim in claims)
            {
                connection.Execute(
                    "DELETE FROM UserClaims WHERE UserId = @UserId AND ClaimType = @ClaimType AND ClaimValue = @ClaimValue",
                    new { UserId = user.Id, ClaimType = claim.Type, ClaimValue = claim.Value });
            }
            return Task.CompletedTask;
        }

        // IUserLoginStore
        public Task<IList<UserLoginInfo>> GetLoginsAsync(User user, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            var logins = await connection.QueryAsync<UserLogin>(
                "SELECT * FROM UserLogins WHERE UserId = @UserId", new { UserId = user.Id });
            return Task.FromResult<IList<UserLoginInfo>>(logins.Select(l => l.ToUserLoginInfo()).ToList());
        }

        public Task AddLoginAsync(User user, UserLoginInfo login, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            var sql = "INSERT INTO UserLogins (UserId, LoginProvider, ProviderKey, ProviderDisplayName) VALUES (@UserId, @LoginProvider, @ProviderKey, @ProviderDisplayName)";
            connection.Execute(sql, new { UserId = user.Id, LoginProvider = login.LoginProvider, ProviderKey = login.ProviderKey, ProviderDisplayName = login.ProviderDisplayName });
            return Task.CompletedTask;
        }

        public Task RemoveLoginAsync(User user, string loginProvider, string providerKey, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            connection.Execute(
                "DELETE FROM UserLogins WHERE UserId = @UserId AND LoginProvider = @LoginProvider AND ProviderKey = @ProviderKey",
                new { UserId = user.Id, LoginProvider = loginProvider, ProviderKey = providerKey });
            return Task.CompletedTask;
        }

        public async Task<User?> FindByLoginAsync(string loginProvider, string providerKey, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            var userId = await connection.QueryFirstOrDefaultAsync<int?>(
                "SELECT UserId FROM UserLogins WHERE LoginProvider = @LoginProvider AND ProviderKey = @ProviderKey",
                new { LoginProvider = loginProvider, ProviderKey = providerKey });
            return userId.HasValue ? await FindByIdAsync(userId.Value.ToString(), cancellationToken) : null;
        }

        // IUserRoleStore
        public Task AddToRoleAsync(User user, string roleName, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            var roleId = connection.QueryFirstOrDefault<int?>(
                "SELECT Id FROM Roles WHERE NormalizedName = @NormalizedName", 
                new { NormalizedName = roleName.ToUpperInvariant() });
            if (roleId.HasValue)
            {
                connection.Execute(
                    "INSERT INTO UserRoles (UserId, RoleId) VALUES (@UserId, @RoleId)",
                    new { UserId = user.Id, RoleId = roleId.Value });
            }
            return Task.CompletedTask;
        }

        public Task RemoveFromRoleAsync(User user, string roleName, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            connection.Execute(
                "DELETE ur FROM UserRoles ur JOIN Roles r ON r.Id = ur.RoleId WHERE ur.UserId = @UserId AND r.NormalizedName = @NormalizedName",
                new { UserId = user.Id, NormalizedName = roleName.ToUpperInvariant() });
            return Task.CompletedTask;
        }

        public async Task<IList<string>> GetRolesAsync(User user, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            var roles = await connection.QueryAsync<string>(
                "SELECT r.Name FROM Roles r JOIN UserRoles ur ON ur.RoleId = r.Id WHERE ur.UserId = @UserId",
                new { UserId = user.Id });
            return roles.ToList();
        }

        public async Task<bool> IsInRoleAsync(User user, string roleName, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            var count = await connection.ExecuteScalarAsync<int>(
                "SELECT COUNT(*) FROM UserRoles ur JOIN Roles r ON r.Id = ur.RoleId WHERE ur.UserId = @UserId AND r.NormalizedName = @NormalizedName",
                new { UserId = user.Id, NormalizedName = roleName.ToUpperInvariant() });
            return count > 0;
        }

        public async Task<IList<User>> GetUsersInRoleAsync(string roleName, CancellationToken cancellationToken)
        {
            using var connection = CreateConnection();
            var users = await connection.QueryAsync<User>(
                "SELECT u.* FROM Users u JOIN UserRoles ur ON ur.UserId = u.Id JOIN Roles r ON r.Id = ur.RoleId WHERE r.NormalizedName = @NormalizedName",
                new { NormalizedName = roleName.ToUpperInvariant() });
            return users.ToList();
        }

        // IUserSecurityStampStore
        public Task SetSecurityStampAsync(User user, string? stamp, CancellationToken cancellationToken)
        {
            user.SecurityStamp = stamp;
            return Task.CompletedTask;
        }

        public Task<string?> GetSecurityStampAsync(User user, CancellationToken cancellationToken)
            => Task.FromResult(user.SecurityStamp);

        // IUserAuthenticatorKeyStore
        public Task SetAuthenticatorKeyAsync(User user, string? key, CancellationToken cancellationToken)
            => Task.CompletedTask; // Not implemented

        public Task<string?> GetAuthenticatorKeyAsync(User user, CancellationToken cancellationToken)
            => Task.FromResult<string?>(null);

        // IUserTwoFactorRecoveryCodeStore
        public Task ReplaceCodesAsync(User user, IEnumerable<string> recoveryCodes, CancellationToken cancellationToken)
            => Task.CompletedTask; // Not implemented

        public Task<bool> RedeemCodeAsync(User user, string code, CancellationToken cancellationToken)
            => Task.FromResult(false); // Not implemented

        public Task<int> CountCodesAsync(User user, CancellationToken cancellationToken)
            => Task.FromResult(0);

        public void Dispose() { }
    }

    // Helper classes for claims and logins
    [Table("UserClaims")]
    public class UserClaim
    {
        [Key]
        [ExplicitKey]
        public int Id { get; set; }
        public int UserId { get; set; }
        public string ClaimType { get; set; } = string.Empty;
        public string ClaimValue { get; set; } = string.Empty;

        public Claim ToClaim() => new Claim(ClaimType, ClaimValue);
    }

    [Table("UserLogins")]
    public class UserLogin
    {
        [Key]
        [ExplicitKey]
        public int Id { get; set; }
        public int UserId { get; set; }
        public string LoginProvider { get; set; } = string.Empty;
        public string ProviderKey { get; set; } = string.Empty;
        public string ProviderDisplayName { get; set; } = string.Empty;

        public UserLoginInfo ToUserLoginInfo() => new UserLoginInfo(LoginProvider, ProviderKey, ProviderDisplayName);
    }
}
