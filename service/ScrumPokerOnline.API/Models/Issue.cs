namespace ScrumPokerOnline.API.Models
{
    public class Issue
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Average { get; set; }
        public bool IsVoting { get; set; }

        public Issue(string name)
        {
            Id = Guid.NewGuid().ToString();
            Name = name;
            Average = "-";
            IsVoting = false;
        }
    }
}
