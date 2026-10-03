using BCrypt.Net;

class Program
{
    static void Main()
    {
        string password = "Test@123";
        string hash = BCrypt.Net.BCrypt.HashPassword(password, 11);
        Console.WriteLine($"Password: {password}");
        Console.WriteLine($"Hash: {hash}");
        Console.WriteLine($"Verify: {BCrypt.Net.BCrypt.Verify(password, hash)}");
    }
}
