import React from "react";
import styled from "styled-components";
import { GroupComponentWrapper, Header } from "./common";
import { RemoveButton as Button } from "../Utilities/common";

const GroupsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 2em;

    max-height: 150px;
    overflow: scroll;
    overflow-x: hidden;

    > p {
        margin: 0.4em 0 0.4em 0.4em;
    }
`;

const LabelWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr calc(2em + 15px);

    h4 {
        margin: 0.5em 0;
    }
`;


function Label(props) {
    return (
        <LabelWrapper>
            <h4 style={{ gridColumn: 1 }}>Name</h4>
            <h4 style={{ gridColumn: 2 }}>Key</h4>
        </LabelWrapper>
    );
}

function GroupPanel(props) {
    return (
        <>
            <p style={{ gridColumn: 1 }}>{props.name}</p>
            <p style={{ gridColumn: 2 }}>{props.groupKey}</p>
            <Button
                onClick={() => props.handleClick(props.groupKey)}
                style={{ gridColumn: 3 }}
                title="Leave group"  >
                <p>x</p>
            </Button>
        </>
    );
}


export default class ManageForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    async handleClick(groupKey) {
        let res = await fetch("/api/leave_group/" + groupKey);

        if (res.ok) {
            this.props.afterSuccessfulFetch();
        }
        else {
            let message = await res.text();
            console.error(message);
        }
    }

    render() {
        return (
            <GroupComponentWrapper>
                <Header
                    for="manage"
                    handleClick={this.props.handleClick}
                    opened={this.props.opened} >
                    Manage your groups
                </Header>
                <div className={this.props.opened ? "" : "hidden"}>
                    <Label />
                    <GroupsWrapper>
                        {this.props.groups.map( (group, i) => (
                            <GroupPanel 
                                style={{ gridColumn: 1 / 3 }} 
                                name={group.name} 
                                groupKey={group.key} 
                                handleClick={this.handleClick} 
                                key={i} />
                        ))}
                    </GroupsWrapper>
                </div>

            </GroupComponentWrapper>
        );
    }
}