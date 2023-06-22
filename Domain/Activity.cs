namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; }
        public string title { get; set; }
        public DateTime date { get; set; }
        public string Descriptiom { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
    }
}