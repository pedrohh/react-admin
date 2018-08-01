import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { DropTarget } from 'react-dnd';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';

import { DROP_TARGET_TYPE } from './constants';
import { translate } from 'ra-core';

const styles = theme => ({
    root: {
        marginBottom: theme.spacing.unit * 2,
    },
});

class RootDropTarget extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        translate: PropTypes.func.isRequired,
    };

    render() {
        const { classes, connectDropTarget, translate } = this.props;

        return connectDropTarget(
            <div className={classes.root}>
                <ListItem>
                    {translate('ra.tree.root_target', {
                        _: 'Drop the item here to make it top level',
                    })}
                </ListItem>
            </div>
        );
    }
}

const dropTargetSpecs = {
    drop(props, monitor) {
        if (monitor.isOver({ shallow: true })) {
            return { id: null, record: { id: null } };
        }

        return undefined;
    },
};

const dropTargetConnect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
});

export default compose(
    DropTarget(DROP_TARGET_TYPE, dropTargetSpecs, dropTargetConnect),
    translate,
    withStyles(styles)
)(RootDropTarget);
