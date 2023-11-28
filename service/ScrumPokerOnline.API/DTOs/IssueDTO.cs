namespace ScrumPokerOnline.API.DTOs
{
    public class IssueDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int? Average { get; set; }
        public bool IsVoting { get; set; }
    }
}
