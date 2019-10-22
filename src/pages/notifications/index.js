import React from 'react';
import withStore from '~/hocs/withStore';
import styles from './index.module.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

class Notifications extends React.Component{
    render(){
        let model = this.props.stores.notifications;
        console.log(model.list);
        let messages = model.list.map((note) => {
            return (
            <CSSTransition key={note.id} 
                           classNames={{
                             enter: styles.itemEnter,
                             enterActive: styles.itemEnterActive,
                             exitActive: styles.itemLeaveActive
                           }}
                           timeout={500}
            >
                <div className={styles.item} onDoubleClick={() => {model.remove(note.id)}}>
                    {note.message}
                </div>
            </CSSTransition>
            );
        });

        return (
            <TransitionGroup className={styles.box}>
                {messages}
            </TransitionGroup>
        );
    }
}

export default withStore(Notifications);