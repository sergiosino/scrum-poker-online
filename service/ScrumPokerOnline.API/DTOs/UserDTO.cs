namespace ScrumPokerOnline.API.DTOs
{
    public class UserDTO
    {
        public required string Name { get; set; }
        public required string Room { get; set; }
        public string? Value { get; set; }
        public bool IsAdmin { get; set; }
    }
}
