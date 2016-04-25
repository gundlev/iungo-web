import React from 'react';
import Dropzone from 'react-dropzone';
import {parse} from 'papaparse';

import { Input, Button, Table } from 'react-toolbox';

import isEmail from 'validator/lib/isEmail';

class Members extends React.Component {
    state = {
        group_id: "forsam", //TODO TEMP
        source: [],
        selected: [],
        model: {Email: {type: String}, Navn: {type: String}},
        name: "",
        email: ""
    };

    onDrop = (files) => {
        parse(files[0], {
            header: true,
            skipEmptyLines: true,
            complete: ({data, meta}) => {
                const model = meta.fields.reduce((acc, key) => ({
                [key]: {type: (typeof key)}
                , ...acc
                }), ({}));

                const source = [...data, ...this.state.source];

                this.setState({
                    source, model
                })
            }
        });
    };

    onInviteClick = () => console.log("onInviteClick");

    onSelectAllClick(){

    }

    onDeselectAllClick(){

    }

    handleChange(name, value){
        this.setState({...this.state, [name]: value});
    }

    handleSelect = (selected) => {
        this.setState({selected});
    };

    addToList = () => this.setState({
        source: [{Navn: this.state.name, Email: this.state.email} , ...this.state.source ],
        name: undefined,
        email: undefined
    });

    componentWillMount(){
        console.log("mount!")
    }

    render(){
        const {name, email} = this.state;

        console.log("state", this.state)

        return (
            <div>
                <div>
                    <Input type='text' label='Name' name='name' maxLength={16}
                           onChange={this.handleChange.bind(this, 'name')}
                           value={name} />
                    <Input type='email' label='Email'
                           onChange={this.handleChange.bind(this, 'email')}
                           value={email} />
                    <Button label="Add to list" onClick={this.addToList.bind(this)}
                            raised primary disabled={!isValidInviteDetails(name, email)}/>
                </div>
                <div>
                    <Dropzone accept=".csv" multiple={false} onDrop={this.onDrop}>
                        <div style={{padding: 7}}>
                            Drop a CSV file here or Click to select!
                        </div>
                    </Dropzone>

                {
                    this.state.source.length ?
                        <div>
                            <Table
                                model={this.state.model}
                                onSelect={this.handleSelect}
                                selectable
                                selected={this.state.selected}
                                source={this.state.source}
                            />
                            <Button label="Send invitations" onClick={this.onInviteClick}
                                    raised primary disabled={this.state.selected.length === 0}/>
                        </div>
                     : <div> </div>

                }
                </div>
            </div>
        )
    }

}

function isValidInviteDetails(name, email){
    return (name && name.length > 1) && isEmail(email)
}

export default Members;
