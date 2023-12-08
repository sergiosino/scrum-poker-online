<div align="center">

# Scrum poker online
  
</div>



<!-- ABOUT THE PROJECT -->
## About The Project

This is an online adaptation of the Planning Poker estimation strategy.

The player who creates the room will be the administrator. He will be able to add issues, start voting on issues and kick other players.

The rest of the players will be participants and must wait for the administrator to select an issue to be able to select a card.

Once the players have selected their cards they can calculate the average. When a player hits the calculate button, all the cards will be shown and the average will be saved in the issue.

The client is ready to deploy on Vercel and the service on Fly.io. By default it is configured to use MongoDB.
You can see the demo here: https://scrum-poker-online.vercel.app/


## Desktop

In the desktop view you can see both the dashboard and the list of issues on the left.

<div align="center">

![scrum-poker-online-desktop](https://github.com/sergiosino/scrum-poker-online/assets/35705449/00b7240f-883c-4460-82f8-829e0c54ca5c)

</div>

## Mobile

In the mobile view, the game board is visible and the list of issues is hidden in a sidebar. To see it it will be necessary to click on the Show issues button.

<div align="center">
  
![scrum-poker-online-mobile](https://github.com/sergiosino/scrum-poker-online/assets/35705449/531b8625-7fb7-47c7-a602-f93b3f4ba786)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
![scrum-poker-online-mobile-2](https://github.com/sergiosino/scrum-poker-online/assets/35705449/aebdfdf8-33dc-445e-be7d-ac4adbe30103)

</div>



<!-- GETTING STARTED -->
## Getting Started

1. Clone the repo.
   ```sh
   git clone https://github.com/sergiosino/scrum-poker-online.git
   ```
3. For the service, check the `.env.example` and create your own `.env` file with your MongoDB connection string. There are some options that can be easily modified from the `appsettings.json` file.
4. Start the API with Visual Studio or your favourite IDE.
5. Go to the client and install NPM packages.
   ```sh
   npm install
   ```
6. Enter your API url in a `.env` based on the `.env.example` file included.
7. Run the client.
   ```sh
   npm run dev
   ```



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.
