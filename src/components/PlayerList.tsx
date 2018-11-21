import * as React from "react";
import MediaStreamRecorder from 'msr';

interface IProps {
    players: any[],
    selectNewPlayer: any,
    searchByName: any
}

export default class PlayerList extends React.Component<IProps, {}> {
    constructor(props: any) {
        super(props)   
        this.searchByName = this.searchByName.bind(this)
    }

	public render() {
		return (
			<div className="container player-list-wrapper">
                <div className="row player-list-heading">
                    <div className="input-group">
                        <input type="text" id="search-name-textbox" className="form-control" placeholder="Search By Name" />
                        <div className="btn" onClick={this.searchNameByVoice}><i className="fa fa-microphone" /></div>
                        <div className="input-group-append">
                            <div className="btn btn-outline-secondary search-button" onClick = {this.searchByName}>Search</div>
                        </div>
                    </div>  
                </div>
                <div className="row player-list-table">
                    <table className="table table-striped">
                        <tbody>
                            <td><strong>ID</strong></td>
                            <td><strong>Name</strong></td>
                            <td><strong>Country</strong></td>
                            <td><strong>Runs</strong></td>
                            <td><strong>Wickets</strong></td>
                            <td><strong>Catches</strong></td>
                            {this.createTable()}
                        </tbody>
                    </table>
                </div>
            </div>
		);
    }

    // Construct table using meme list
	private createTable() {
        const table:any[] = []
        const playerList = this.props.players
        if (playerList == null) {
            return table
        }

        for (let i = 0; i < playerList.length; i++) {
            const children = []
            const player = playerList[i]
            children.push(<td key={"id" + i}>{player.id}</td>)
            children.push(<td key={"name" + i}>{player.name}</td>)
            children.push(<td key={"country" + i}>{player.country}</td>)
            children.push(<td key={"runs" + i}>{player.runs}</td>)
            children.push(<td key={"wickets" + i}>{player.wickets}</td>)
            children.push(<td key={"catches" + i}>{player.catches}</td>)
            table.push(<tr key={i+""} id={i+""} onClick= {this.selectRow.bind(this, i)}>{children}</tr>)
        }
        return table
    }
    
    // Meme selection handler to display selected meme in details component
    private selectRow(index: any) {
        const selectedPlayer = this.props.players[index]
        if (selectedPlayer != null) {
            this.props.selectNewPlayer(selectedPlayer)
        }
    }

    // Search meme by tag
    private searchByName() {
        const textBox = document.getElementById("search-name-textbox") as HTMLInputElement
        if (textBox === null) {
            return;
        }
        const name = textBox.value 
        this.props.searchByName(name)  
    }

    private searchNameByVoice() {
        const mediaConstraints = {
            audio: true
        }
        const onMediaSuccess = (stream: any) => {
            const mediaRecorder = new MediaStreamRecorder(stream);
            mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
            mediaRecorder.ondataavailable = (blob: any) => {
                this.postAudio(blob);
                mediaRecorder.stop()
            }
            mediaRecorder.start(3000);
        }
    
        navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError)
    
        function onMediaError(e: any) {
            console.error('media error', e);
        }  
    }

    private postAudio(blob : any) {
        let accessToken: any;
        fetch('https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken', {
            headers: {
                'Content-Length': '0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Ocp-Apim-Subscription-Key': '4d3d4b2bc7a04f96b60585b1610a7fc7'
            },
            method: 'POST'
        }).then((response) => {
            console.log(response.text())
            return response.text()
        }).then((response) => {
            console.log(response)
            accessToken = response
        }).catch((error) => {
            console.log("Error", error)
        });
    
        // posting audio
        fetch('https://westus.api.cognitive.microsoft.com/sts/v1.0', {
            body: blob, // this is a .wav audio file    
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer' + accessToken,
                'Content-Type': 'audio/wav;codec=audio/pcm; samplerate=16000',
                'Ocp-Apim-Subscription-Key': '4d3d4b2bc7a04f96b60585b1610a7fc7'
            },    
            method: 'POST'
        }).then((res) => {
            return res.json()
        }).then((res: any) => {
            console.log(res)
        }).catch((error) => {
            console.log("Error", error)
        });
    }

}