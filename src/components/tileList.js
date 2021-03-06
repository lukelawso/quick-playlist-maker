import axios from 'axios';
import React, { Component } from 'react';
export default class TileList extends Component {
    selectTile(index) {
        var uri = this.props.playlists[index].uri;
        var inPlaylist = this.props.playlists[index].loadedTracks.map((item) =>  item.uri).indexOf(this.props.currentTrack.uri) !== -1;
        if (inPlaylist) {
            let config = {
                url: `https://api.spotify.com/v1/playlists/${uri.substring(uri.lastIndexOf(':')+1)}/tracks`,
                method: 'delete',
                headers: {"Content-Type": "application/json; charset=utf-8",'Authorization': 'Bearer ' + this.props.token},
                data: {tracks:[{uri: this.props.currentTrack.uri}]}
            }
            axios(config)
            .then(res => {this.props.updatePlaylistTracks(index, this.props.currentTrack)})
            .catch(err => {alert("Error removing track"); console.log(err);});       
        } else {
            axios.post(`https://api.spotify.com/v1/playlists/${uri.substring(uri.lastIndexOf(':')+1)}/tracks?uris=${this.props.currentTrack.uri}`,
            {}, {headers: {'Authorization': 'Bearer ' + this.props.token}})
            .then(res => {this.props.updatePlaylistTracks(index, this.props.currentTrack)})
            .catch(err => {alert("Error adding to playlist (might be full)"); console.log(err);});
        }
    }

    render() {
        const bList = [];
        for (let i = 0; i < this.props.playlists.length; i++) {
            if (this.props.playlists[i].selected) {
                let inPlaylist = this.props.playlists[i].loadedTracks.indexOf(this.props.currentTrack) !== -1;

                //Show button
                bList.push(<button 
                    className={`list-group-item list-group-item-action btn btn-success text-center ${inPlaylist  ? "active" : ""}`} 
                    style={{
                        height: "20vh",
                        borderRadius: "5px"
                    }}
                    key={i} 
                    onClick={() => {
                        this.selectTile(i);
                    }}>
                    {this.props.playlists[i].name}
                </button>);
            }
        }
        return (
            <div style={{margin: "10px"}}>                
                <ul
                    style={{paddingLeft: "0px", maxHeight: "800px", display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr 1fr 1fr"}}>
                    {bList}
                </ul>
            </div>
        )
    }
}
