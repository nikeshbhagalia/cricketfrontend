import * as React from "react";
import Modal from 'react-responsive-modal';

interface IProps {
    currentPlayer: any
}

interface IState {
    open: boolean
}

export default class PlayerDetail extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            open: false
        }

        this.updatePlayer = this.updatePlayer.bind(this)

    }

	public render() {
        const currentPlayer = this.props.currentPlayer
        const { open } = this.state;
		return (
			<div className="container player-wrapper">
                <div className="row player-heading">
                    <b>{currentPlayer.name}</b>&nbsp; Country: {currentPlayer.country}&nbsp; Runs: {currentPlayer.runs}&nbsp; Wickets: {currentPlayer.wickets}&nbsp; Catches: {currentPlayer.catches}
                </div>
                <div className="row player-img">
                    <img src={currentPlayer.url}/>
                </div>
                
                <div className="row player-done-button">
                    <div className="btn btn-primary btn-action" onClick={this.onOpenModal}>Edit </div>
                    <div className="btn btn-primary btn-action" onClick={this.deletePlayer.bind(this, currentPlayer.id)}>Delete </div>
                </div>
                <Modal open={open} onClose={this.onCloseModal}>
                    <form>
                        <div className="form-group">
                            <label>Player Name</label>
                            <input type="text" className="form-control" id="player-edit-name-input" placeholder="Enter Name"/>
                        </div>
                        <div className="form-group">
                            <label>Country</label>
                            <input type="text" className="form-control" id="player-edit-country-input" placeholder="Enter Country"/>
                        </div>
                        <div className="form-group">
                            <label>Runs</label>
                            <input type="text" className="form-control" id="player-edit-runs-input" placeholder="Enter Runs"/>
                        </div>
                        <div className="form-group">
                            <label>Wickets</label>
                            <input type="text" className="form-control" id="player-edit-wickets-input" placeholder="Enter Wickets"/>
                        </div>
                        <div className="form-group">
                            <label>Catches</label>
                            <input type="text" className="form-control" id="player-edit-catches-input" placeholder="Enter Catches"/>
                        </div>
                        <button type="button" className="btn" onClick={this.updatePlayer}>Save</button>
                    </form>
                </Modal>
            </div>
		);
    }

    // Modal Open
    private onOpenModal = () => {
        this.setState({ open: true });
	  };
    
    // Modal Close
    private onCloseModal = () => {
		this.setState({ open: false });
    };
    
    private updatePlayer(){
        const nameInput = document.getElementById("player-edit-name-input") as HTMLInputElement
        const countryInput = document.getElementById("player-edit-country-input") as HTMLInputElement
        const runsInput = document.getElementById("player-edit-runs-input") as HTMLInputElement
        const wicketsInput = document.getElementById("player-edit-wickets-input") as HTMLInputElement
        const catchesInput = document.getElementById("player-edit-catches-input") as HTMLInputElement
    
        if (nameInput === null || countryInput === null || runsInput == null || wicketsInput == null || catchesInput == null) {
			return;
		}
    
        const currentPlayer = this.props.currentPlayer
        const url = "https://cricketapi2018.azurewebsites.net/api/stats/" + currentPlayer.id
        const updatedName = nameInput.value
        const updatedCountry = countryInput.value
        const updatedRuns = runsInput.value
        const updatedWickets = wicketsInput.value
        const updatedCatches = catchesInput.value
        fetch(url, {
            body: JSON.stringify({
                "name": updatedName,
                "id": currentPlayer.id,
                "country": updatedCountry,
                "runs": updatedRuns,
                "wickets": updatedWickets,
                "url": currentPlayer.url,
                "catches": updatedCatches
            }),
            headers: {'cache-control': 'no-cache','Content-Type': 'application/json'},
            method: 'PUT'
        })
        .then((response : any) => {
            if (!response.ok) {
                // Error State
                alert(response.statusText + " " + url)
            } else {
                location.reload()
            }
        })
    }

    private deletePlayer(id: any) {
        const url = "https://cricketapi2018.azurewebsites.net/api/stats/" + id
    
        fetch(url, {
            method: 'DELETE'
        })
        .then((response : any) => {
            if (!response.ok) {
                // Error Response
                alert(response.statusText)
            }
            else {
                location.reload()
            }
        })
    }

}