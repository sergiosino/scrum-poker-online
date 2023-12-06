using ScrumPokerOnline.API.Models;

namespace ScrumPokerOnline.API.DTOs
{
    public class IssueDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Average { get; set; }
        public bool IsVoting { get; set; }

        public IssueDTO(Issue issue)
        {
            Id = issue.Id;
            Name = issue.Name;
            Average = issue.Average;
            IsVoting = issue.IsVoting;
        }
    }
}
