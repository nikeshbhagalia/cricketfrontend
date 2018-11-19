import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
import PlayerDetail from './components/PlayerDetail';
import PlayerList from './components/PlayerList';
import PatrickLogo from './patrick-logo.png';


interface IState {
	currentPlayer: any,
	players: any[],
	open: boolean,
	uploadFileList: any,
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			currentPlayer: {"id":0, "name":"Loading ","url":"","country":"","runs":"","wickets":"","catches":"0"},
			players: [],
			open: false,
			uploadFileList: null
		}     	
		this.selectNewPlayer = this.selectNewPlayer.bind(this)
		this.fetchPlayers = this.fetchPlayers.bind(this)
		this.fetchPlayers("")
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.uploadPlayer = this.uploadPlayer.bind(this)
	}

	public render() {
		const { open } = this.state;
		return (
		<div>
			<div className="header-wrapper">
				<div className="container header">
					<img src={PatrickLogo} height='40'/>&nbsp; Cricket - MSA 2018 &nbsp;
					<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Add Player</div>
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-7">
						<PlayerDetail currentPlayer={this.state.currentPlayer} />
					</div>
					<div className="col-5">
						<PlayerList players={this.state.players} selectNewPlayer={this.selectNewPlayer} searchByName={this.fetchPlayers}/>
					</div>
				</div>
			</div>
			<Modal open={open} onClose={this.onCloseModal}>
				<form>
				<div className="form-group">
                            <label>Player Name</label>
                            <input type="text" className="form-control" id="player-name-input" placeholder="Enter Name"/>
                        </div>
                        <div className="form-group">
                            <label>Country</label>
                            <input type="text" className="form-control" id="player-country-input" placeholder="Enter Country"/>
                        </div>
                        <div className="form-group">
                            <label>Runs</label>
                            <input type="text" className="form-control" id="player-runs-input" placeholder="Enter Runs"/>
                        </div>
                        <div className="form-group">
                            <label>Wickets</label>
                            <input type="text" className="form-control" id="player-wickets-input" placeholder="Enter Wickets"/>
                        </div>
                        <div className="form-group">
                            <label>Catches</label>
                            <input type="text" className="form-control" id="player-catches-input" placeholder="Enter Catches"/>
                        </div>
					<div className="form-group">
						<label>Image</label>
						<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="player-image-input" />
					</div>

					<button type="button" className="btn" onClick={this.uploadPlayer}>Upload</button>
				</form>
			</Modal>
		</div>
		);
	}

	// Modal open
	private onOpenModal = () => {
		this.setState({ open: true });
	  };
	
	// Modal close
	private onCloseModal = () => {
		this.setState({ open: false });
	};
	
	// Change selected meme
	private selectNewPlayer(newPlayer: any) {
		this.setState({
			currentPlayer: newPlayer
		})
	}

	private fetchPlayers(name: any) {
		let url = "http://cricketapi2018.azurewebsites.net/api/stats"
		if (name !== "") {
			url += "/name?=" + name
		}
		fetch(url, {
			method: 'GET'
		})
		.then(res => res.json())
		.then(json => {
			let currentPlayer = json[0]
			if (currentPlayer === undefined) {
				currentPlayer = {"id":0, "name":"No Players with that Name ","url":"","country":"","runs":"","wickets":"","catches":""}
			}
			this.setState({
				currentPlayer,
				players: json
			})
		});
	}

	private handleFileUpload(fileList: any) {
		this.setState({
			uploadFileList: fileList.target.files
		})
	}

	private uploadPlayer() {
		const nameInput = document.getElementById("player-name-input") as HTMLInputElement
		const countryInput = document.getElementById("player-country-input") as HTMLInputElement
		const runsInput = document.getElementById("player-runs-input") as HTMLInputElement
		const wicketsInput = document.getElementById("player-wickets-input") as HTMLInputElement
		const catchesInput = document.getElementById("player-catches-input") as HTMLInputElement
		const imageFile = this.state.uploadFileList[0]
	
		if (nameInput === null || countryInput === null || runsInput == null || wicketsInput == null || catchesInput == null || imageFile === null) {
			return;
		}
	
		const name = nameInput.value
		const country = countryInput.value
		const runs = runsInput.value
		const wickets = wicketsInput.value
		const catches = catchesInput.value
		const url = "https://cricketapi2018.azurewebsites.net/api/stats/upload"
	
		const formData = new FormData()
		formData.append("Name", name)
		formData.append("Country", country)
		formData.append("Runs", runs)
		formData.append("Wickets", wickets)
		formData.append("Catches", catches)
		formData.append("image", imageFile)
	
		fetch(url, {
			body: formData,
			headers: {'cache-control': 'no-cache'},
			method: 'POST'
		})
		.then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText)
			} else {
				location.reload()
			}
		})
	}
}

export default App;
