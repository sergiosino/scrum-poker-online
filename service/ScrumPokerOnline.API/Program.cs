using DotNetEnv;
using MongoDB.Driver;
using ScrumPokerOnline.API.Hubs;
using ScrumPokerOnline.API.Repositories;
using ScrumPokerOnline.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CORSPolicy",
        builder => builder
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        .SetIsOriginAllowed((hosts) => true));
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

Env.Load();
string connectionString = Environment.GetEnvironmentVariable("MONGO_CONNECTION") ?? string.Empty;
string databaseName = builder.Configuration["MongoDbName"] ?? string.Empty;

builder.Services.AddScoped(x => new MongoClient(connectionString).GetDatabase(databaseName));
builder.Services.AddScoped<RoomsService>();
builder.Services.AddScoped<RoomsRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CORSPolicy");
app.UseRouting();

#pragma warning disable ASP0014 // Suggest using top level route registrations
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<ScrumPokerOnlineHub>("/scrum-poker-online");
});
#pragma warning restore ASP0014 // Suggest using top level route registrations

app.UseHttpsRedirection();

//app.UseAuthorization();

app.MapControllers();

app.Run();
