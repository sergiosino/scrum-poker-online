import CentralTable from "../components/CentralTable"
import GameInfo from "../components/GameInfo"
import PokerCards from "../components/cards/PokerCards"
import PokerIssues from "../components/issues/PokerIssues"

export default function GameView() {
    return (
        <>
            <div className='app-principal-container'>
                <div className={'user-info-container user-info-container-in-game'}>
                    <GameInfo />
                </div>
                <div className='central-table-container'>
                    <CentralTable />
                </div>
                <div className='cards-container'>
                    <PokerCards />
                </div>
            </div>
            <PokerIssues />
        </>
    )
}