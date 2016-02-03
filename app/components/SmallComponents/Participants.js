import React from 'react'
import {List, ListItem} from 'react-toolbox'

import Rebase from 're-base'

const URL = "https://brilliant-torch-4963.firebaseio.com/";
let base = Rebase.createClass(URL);

export default ({list}) => list
        ?
        <List>
            <p>Participants:</p>
            { list.map((id) =>
                <Participant key={id} id={id}/>
            )}
        </List>
        :
        <div>No participants</div>
    ;

class Participant extends React.Component{

    constructor(props){
        super(props)
    }

    state = {
        user: null
    };

    componentDidMount(){
        base.fetch(`users/${this.props.id}`, {
            context: this,
            then(user){
                this.setState({
                    user
                })
            }
        });
    }

    render(){
        const {id} = this.props;

        if(!this.state.user){
            return <ListItem
                key={id}
                avatar='https://dl.dropboxusercontent.com/u/2247264/assets/m.jpg'
                caption={"Loading... " + id}
            />
        }

        const {name, company, picture} = this.state.user;

        return <ListItem
            key={id}
            avatar={'data:image/jpg;base64,'+picture}
            caption={name}
            legend={company}
        />
    }

}
