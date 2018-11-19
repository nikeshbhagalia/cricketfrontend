import * as React from "react";

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
                        <div className="input-group-append">
                            <div className="btn btn-outline-secondary search-button" onClick = {this.searchByName}>Search</div>
                        </div>
                    </div>  
                </div>
                <div className="row player-list-table">
                    <table className="table table-striped">
                        <tbody>
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

}