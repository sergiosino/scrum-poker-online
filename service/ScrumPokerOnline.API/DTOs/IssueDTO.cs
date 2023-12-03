namespace ScrumPokerOnline.API.DTOs
{
    public class IssueDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Average { get; set; }
        public bool IsVoting { get; set; }

        public IssueDTO(string name)
        {
            Id = Guid.NewGuid().ToString();
            Name = name;
            Average = "-";
            IsVoting = false;
        }
    }
}
