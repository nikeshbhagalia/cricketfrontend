import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
import PlayerDetail from './components/PlayerDetail';
import PlayerList from './components/PlayerList';
import PatrickLogo from './patrick-logo.png';
import * as Webcam from "react-webcam";


interface IState {
	currentPlayer: any,
	players: any[],
	open: boolean,
	uploadFileList: any,
	playerlist: boolean
	authenticated: boolean,
	refCamera: any,
	predictionResult: any,
	skip: boolean
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			currentPlayer: {"id":0, "name":"Loading ","url":"","country":"","runs":"","wickets":"","catches":"0"},
			players: [],
			open: false,
			uploadFileList: null,
			playerlist: false,
			authenticated: false,
			refCamera: React.createRef(),
			predictionResult: null,
			skip: false
		}     	
		this.selectNewPlayer = this.selectNewPlayer.bind(this)
		this.fetchPlayers = this.fetchPlayers.bind(this)
		this.fetchPlayers("")
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.uploadPlayer = this.uploadPlayer.bind(this)
		this.authenticate = this.authenticate.bind(this)
		this.clearss = this.clearss.bind(this)
	}

	public render() {
		const { open, authenticated } = this.state;
		const checkSession = sessionStorage.getItem('key');
		console.log(checkSession)
		return (
		<div>
			<div>
			<div className="header-wrapper">
					<div className="container header">
						<img src={PatrickLogo} height='40'/>&nbsp; CricStats &nbsp;
						{
							!this.state.skip &&
								<div id="bt" className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Add Player</div> &&
								<div id="bt" className="btn btn-primary btn-action btn-add" onClick={this.clearss}>Logout</div>
						}
					</div>
				</div>
			{(!authenticated && checkSession !== "authenticated") ?
				<Modal open={!authenticated} onClose={this.authenticate} closeOnOverlayClick={false} showCloseIcon={false} center={true}>
					<div className="container header login">
						Login
					</div>
					<Webcam audio={false} screenshotFormat="image/jpeg" ref={this.state.refCamera} />
					<div className="row nav-row">
						<div className="btn btn-primary bottom-button" onClick={this.authenticate}>Login</div>
						<div className="btn btn-primary bottom-button" onClick={this.skip}>Skip</div>
					</div>
				</Modal> : 
				<div>
				<div className="background">
					<div className="container">
						<div className="row top-padding">
							<div 
								className="playerlist"
								onClick={this.togglelist}
							>
							{
								!this.state.playerlist ?
								<span>Player List</span>
								:
								<span>Players</span>
							}
							</div>
							<div className="col-lg-12">
							{
								!this.state.playerlist ?
								<PlayerDetail currentPlayer={this.state.currentPlayer} skip={this.state.skip} />
								:
								<PlayerList players={this.state.players} selectNewPlayer={this.selectNewPlayer} searchByName={this.fetchPlayers}/>
							}
							</div>
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
			}
			</div>
		</div>
		);
	}

	// Call custom vision model
	private getFaceRecognitionResult(image: string) {
		const url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/74e6b183-ae3a-4e0a-8941-da2966a5dce1/image?iterationId=64eae297-feb1-472b-a843-1db6ee8e1090"
		if (image === null) {
			return;
		}
		const base64 = require('base64-js');
		const base64content = image.split(";")[1].split(",")[1]
		const byteArray = base64.toByteArray(base64content);
		fetch(url, {
			body: byteArray,
			headers: {
				'cache-control': 'no-cache', 'Prediction-Key': 'c09ded12dabb44e99c2022d755b59a9a', 'Content-Type': 'application/octet-stream'
			},
			method: 'POST'
		})
			.then((response: any) => {
				if (!response.ok) {
					// Error State
					alert(response.statusText)
				} else {
					response.json().then((json: any) => {
						console.log(json.predictions[0])
						this.setState({predictionResult: json.predictions[0] })
						if (this.state.predictionResult.probability > 0.0) {
							sessionStorage.setItem('key', 'authenticated');
							this.setState({authenticated: true})
						} else {
							this.setState({authenticated: false})
							
						}
					})
				}
			})
	}

	// Authenticate
	private authenticate() {
		const screenshot = this.state.refCamera.current.getScreenshot();
		this.getFaceRecognitionResult(screenshot);
	}

	private clearss() {
		sessionStorage.clear();
		location.reload();
	}

	private skip = () => {
		this.setState({ 
			authenticated: true,
			skip: true
		});
	}

	private togglelist = () => {
		this.setState({ playerlist: !this.state.playerlist})
	}

	// Modal open
	private onOpenModal = () => {
		this.setState({ 
			open: true,
		});
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
			url += "/name/" + name
		}
		fetch(url, {
			method: 'GET'
		})
		.then(res => res.json())
		.catch( reason => {
			// response is not a valid json string
		})
		.then(json => {
			let currentPlayer = json
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
		this.setState({playerlist: false,
		})
		const nameInput = document.getElementById("player-name-input") as HTMLInputElement
		const countryInput = document.getElementById("player-country-input") as HTMLInputElement
		const runsInput = document.getElementById("player-runs-input") as HTMLInputElement
		const wicketsInput = document.getElementById("player-wickets-input") as HTMLInputElement
		const catchesInput = document.getElementById("player-catches-input") as HTMLInputElement
		
		if(this.state.uploadFileList == null){
			const name = nameInput.value
			const country = countryInput.value
			const runs = runsInput.value
			const wickets = wicketsInput.value
			const catches = catchesInput.value
			const url = "https://cricketapi2018.azurewebsites.net/api/stats/upload"
			if(name.trim() == ""){
				alert("Please Enter a Name")
				return;
			}
			if(country.trim() == ""){
				alert("Please Enter a Country")
				return;
			}
			if(runs.trim() == "" || isNaN(Number(runs.trim()))){
				alert("Please Enter a Valid Amount of Runs")
				return
			}
			if(wickets.trim() == "" || isNaN(Number(wickets.trim()))){
				alert("Please Enter a Valid Amount of Wickets")
				return
			}
			if(catches.trim() == "" || isNaN(Number(catches.trim()))){
				alert("Please Enter a Valid Amount of Catches")
				return
			}
		
			const formData = new FormData()
			formData.append("Name", name)
			formData.append("Country", country)
			formData.append("Runs", runs)
			formData.append("Wickets", wickets)
			formData.append("Catches", catches)
		
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
			console.log({nameInput})
		} else {
			const imageFile = this.state.uploadFileList[0]
			const name = nameInput.value
			const country = countryInput.value
			const runs = runsInput.value
			const wickets = wicketsInput.value
			const catches = catchesInput.value
			const url = "https://cricketapi2018.azurewebsites.net/api/stats/upload"

			if(name.trim() == ""){
				alert("Please Enter a Name")
				return;
			}
			if(country.trim() == ""){
				alert("Please Enter a Country")
				return;
			}
			if(runs.trim() == "" || isNaN(Number(runs.trim()))){
				alert("Please Enter a Valid Amount of Runs")
				return
			}
			if(wickets.trim() == "" || isNaN(Number(wickets.trim()))){
				alert("Please Enter a Valid Amount of Wickets")
				return
			}
			if(catches.trim() == "" || isNaN(Number(catches.trim()))){
				alert("Please Enter a Valid Amount of Catches")
				return
			}
		
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
}

export default App;