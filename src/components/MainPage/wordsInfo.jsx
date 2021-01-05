import React from "react";
import styled from "styled-components";
import { GroupsSelect } from "../Utilities/common";

const ButtonWrapper = styled.div`
    position: relative;
    width: max-content;
    margin: 0 auto;
    
    transition: 400ms all ease;

    &:hover {
        transform: scale(1.2);
    }

    & > button:hover {
        transform: none;
    }

    button {
        padding-right: 20%;
    }

    select {
        position: absolute;
        bottom: 50%;
        right: 1em;
        transform: translate(-50%, 50%);
        border: none;
        background-color: var(--input-color);
        color: var(--form-color);
        font-size: 1.1em;
        text-align: right;
    }

    @media screen and (max-width: 1100px) {
        margin: 0 auto;
        
        select {
        right: 0.3em;
        }
    }
`;

const Button = styled.button`
    height: 3em;
    background-color: var(--input-color);
    color: var(--form-color);
    border: none;
    border-radius: 12px;
    font-size: 36px;
    margin: 0 30px;
    width: 9em;

    &:focus {
        outline: none;
    }


    @media screen and (max-width: 1100px) {
        font-size: 32px;
        height: 2em;
    }
`;

const NewWords = styled.h2`
    font-size: 1.1em;
    color: var(--form-color);
    font-weight: bold;
`;

const CopySucess = styled.h2`
    color: var(--form-color);
    font-weight: bold;
`;

const Wrapper = styled.div`
    text-align: center;
    margin: auto;

    transition: all 400ms ease;   

    span {
        color: var(--form-color);
        font-weight: bold;
    }

    @media screen and (max-width: 1100px) {
        padding-bottom: 10em;
        width: 100%;

        article {
            margin: 20px 0;
        }
        
        h2 {
            margin: 0.5em 0;
        }
    }

    @media screen and (max-width: 1250px) {
        padding-bottom: 15em;
    }
`;


class WordsInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const addedWordsMessage = this.props.newWords.length > 0
            ? <NewWordsInfo newWords={this.props.newWords} />
            : null;

        return (
            <Wrapper>
                <article>
                    {addedWordsMessage}
                    <h2>There are <span>{this.props.wordsCount}</span> words in database.</h2>
                    <h2>Hit the button below to get words from database</h2>
                    <CopySucess>{this.props.copySuccess}</CopySucess>
                </article>

                <GetWordsButton
                    showSuccessMessage={this.props.setSuccessMessage}
                    groups={this.props.groups}
                />
            </Wrapper>
        );
    }
}

class GetWordsButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            group: "all",
            groups: [
                "all",
                ...this.props.groups,
            ]
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleClick(e) {

        let groups = this.state.group == "all" ? this.state.groups.slice(1) : [ this.state.group ];
        let query = groups.reduce( (p, c) => (p += (c + ",") ), "" ).slice(0, -1);

        fetch(`/api/bank?groups=${query}`)
            .then(res => res.json())
            .then(data => {
                navigator.clipboard.writeText(data);
                this.props.showSuccessMessage();
            })
            .catch(err => console.error(err))
    }

    handleChange(e) {
        this.setState({ group: e.target.value })
    }

    render() {
        return (
            <ButtonWrapper>
                <Button
                    type="button"
                    onClick={this.handleClick}>
                    Get words!
                </Button>
                <GroupsSelect
                    handleChange={this.handleChange}
                    value={this.state.group}
                    groups={this.state.groups}
                />
            </ButtonWrapper>
        );
    }
}

function NewWordsInfo(props) {
    return (
        <div>
            <h2>Following words have been added to database:</h2>
            <NewWords>{props.newWords}</NewWords>
        </div>
    )
}

export default WordsInfo;