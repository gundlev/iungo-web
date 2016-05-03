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

    shouldComponentUpdate(nextProps, nextState) {
        const keys = Object.keys(nextProps.groups);
        console.log("shouldComponentUpdate", );
        return keys.indexOf(this.state.group_id) != -1; //&& nextState.group_id
    }

    componentDidUpdate(){
        console.log("did update!")
    }

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
                });

                const { members } = this.props.groups[this.state.group_id]


                // source.forEach( => )
            }
        });
    };

    onInviteClick = () => {
        console.log("onInviteClick")
        
    };

    handleChange(name, value){
        this.setState({...this.state, [name]: value});
    }

    handleSelect = (selected) => {
        this.setState({selected});
    };

    addToList = () => this.setState({
        source: [
            {
                Navn: this.state.name, Email: this.state.email
            } , ...this.state.source
        ],
        name: undefined,
        email: undefined
    });

    componentWillReceiveProps(){
        console.log("mount!")

        console.log(this.props.groups)
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
                            raised primary
                            disabled={!isValidInviteDetails(name, email)}
                    />
                </div>
                <div>
                    <Dropzone accept=".csv" multiple={false} onDrop={this.onDrop}>
                        <div style={{padding: 10}}>
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
                            <Button label="Send invitations"
                                    onClick={this.onInviteClick}
                                    raised primary
                                    disabled={this.state.selected.length === 0}
                            />
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
