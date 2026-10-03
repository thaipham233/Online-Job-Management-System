using Microsoft.AspNetCore.Identity;

class Program
{
    static void Main()
    {
        string password = "Test@123";
        var hasher = new PasswordHasher<string>();
        string hash = hasher.HashPassword(null, password);
        Console.WriteLine($"Password: {password}");
        Console.WriteLine($"Hash: {hash}");
        Console.WriteLine($"Verify: {hasher.VerifyHashedPassword(null, hash, password)}");
    }
}
