import * as React from "react";
import Modal from 'react-responsive-modal';

interface IProps {
    currentPlayer: any,
    skip: boolean
}

interface IState {
    open: boolean,
    playerId: number,
    playerName: string,
    countryEdit: string,
    runsEdit: string,
    wicketsEdit: string,
    catchesEdit: string,
}

export default class PlayerDetail extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            open: false,
            playerId: 0,
            playerName: '',
            countryEdit: '',
            runsEdit: '',
            wicketsEdit: '',
            catchesEdit: '',
        }

        this.updatePlayer = this.updatePlayer.bind(this)

    }

	public render() {
        const currentPlayer = this.props.currentPlayer
        const skip = this.props.skip
        const { open } = this.state;
		return (
            <div className="row odd-even">
                {
                Object.keys(currentPlayer).map((key:any, index) => (
                    <div className="col-lg-3 col-md-4 col-sm-6 padding-around">
                    <div className={`player-wrapper ${index}`}>
                    <div className="player-img">
                        <img src={currentPlayer[key].url}/>
                    </div>
                    <div className={`${key % 2 === 1 ? 'even-stats' : 'odd-stats' } player-stats`}>
                        <p>{currentPlayer[key].name}</p>
                        <p>Country: <span>{currentPlayer[key].country}</span></p>
                        <p>Runs: <span>{currentPlayer[key].runs}</span></p>
                        <p>Wickets: <span>{currentPlayer[key].wickets}</span></p>
                        <p>Catches: <span>{currentPlayer[key].catches}</span></p>
                        {
                            !skip &&
                            <div className="player-done-button">
                                <div className="btn-custom" onClick={this.onOpenModal}>Edit </div>
                                <div className="btn-custom delete" onClick={this.deletePlayer.bind(this, currentPlayer[key].id)}>Delete </div>
                            </div>
                        }
                        
                        <Modal open={open} onClose={this.onCloseModal}>
                            <form>
                                {console.log(currentPlayer[key].id)}
                                <div className="form-group">
                                    <label>Player Name</label>
                                    <input type="text" className="form-control" id="player-edit-name-input" placeholder="Enter Name" onChange={this.updateName.bind(this)}/>
                                </div>
                                <div className="form-group">
                                    <label>Country</label>
                                    <input type="text" className="form-control" id="player-edit-country-input" placeholder="Enter Country" onChange={this.updateCountry.bind(this)}/>
                                </div>
                                <div className="form-group">
                                    <label>Runs</label>
                                    <input type="text" className="form-control" id="player-edit-runs-input" placeholder="Enter Runs" onChange={this.updateRuns.bind(this)}/>
                                </div>
                                <div className="form-group">
                                    <label>Wickets</label>
                                    <input type="text" className="form-control" id="player-edit-wickets-input" placeholder="Enter Wickets" onChange={this.updateWickets.bind(this)}/>
                                </div>
                                <div className="form-group">
                                    <label>Catches</label>
                                    <input type="text" className="form-control" id="player-edit-catches-input" placeholder="Enter Catches" onChange={this.updateCatches.bind(this)}/>
                                </div>
                                <button 
                                    type="button" 
                                    className="btn" 
                                    onClick={
                                        this.updatePlayer.bind(this, index)
                                    }
                                        >
                                    Save
                                </button>
                            </form>
                        </Modal>
                        </div>                    
                    </div>
                </div>
                ))
              }
                
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

    private updateName = (e:any) => {
        this.setState({ playerName: e.target.value });  
        console.log(e.target.value)
    }
    private updateCountry = (e:any) => {
		this.setState({ countryEdit: e.target.value });        
    }
    private updateRuns = (e:any) => {
		this.setState({ runsEdit: e.target.value });        
    }
    private updateWickets = (e:any) => {
		this.setState({ wicketsEdit: e.target.value });        
    }
    private updateCatches = (e:any) => {
		this.setState({ catchesEdit: e.target.value });        
    }
    
    private updatePlayer(index:any){
        const currentPlayer = this.props.currentPlayer[index]
        console.log(this.props.currentPlayer[index])
        const url = "https://cricketapi2018.azurewebsites.net/api/stats/" + currentPlayer.id
        const updatedName = this.state.playerName
        const updatedCountry = this.state.countryEdit
        const updatedRuns = this.state.runsEdit
        const updatedWickets = this.state.wicketsEdit
        const updatedCatches = this.state.catchesEdit
        if(updatedName.trim() == ""){
            alert("Please Enter a Name")
            return;
        }
        if(updatedCountry.trim() == ""){
            alert("Please Enter a Country")
            return;
        }
        if(updatedRuns.trim() == "" || isNaN(Number(updatedRuns.trim()))){
            alert("Please Enter a Valid Amount of Runs")
            return
        }
        if(updatedWickets.trim() == "" || isNaN(Number(updatedWickets.trim()))){
            alert("Please Enter a Valid Amount of Wickets")
            return
        }
        if(updatedCatches.trim() == "" || isNaN(Number(updatedCatches.trim()))){
            alert("Please Enter a Valid Amount of Catches")
            return
        }
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
                this.setState({
                    playerId: 0,
                    playerName: '',
                    countryEdit: '',
                    runsEdit: '',
                    wicketsEdit: '',
                    catchesEdit: '',
                })
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