import React, { Fragment } from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { TreeController } from 'ra-tree-core';

import Tree, { styles } from './Tree';
import DragLayer from './DragLayer';
import DefaultDragPreview from './DragPreview';
import EditableTreeNode from './EditableTreeNode';
import EditableTreeNodeContent from './EditableTreeNodeContent';

export const EditableTree = ({
    children,
    classes,
    dragPreviewComponent,
    treeNodeComponent: TreeNode,
    treeNodeWithChildrenComponent,
    treeNodeContentComponent,
    ...props
}) => (
    <TreeController {...props}>
        {({ getTreeState, tree, ...props }) => (
            <Fragment>
                <DragLayer dragPreviewComponent={dragPreviewComponent} />
                <List
                    classes={{
                        root: classes.root,
                    }}
                    dense
                    disablePadding
                >
                    {tree.map(node => (
                        <TreeNode
                            key={node.id}
                            classes={{
                                ...classes,
                                root: classes.node || undefined,
                            }}
                            getTreeState={getTreeState}
                            node={node}
                            treeNodeComponent={TreeNode}
                            treeNodeWithChildrenComponent={
                                treeNodeWithChildrenComponent
                            }
                            treeNodeContentComponent={treeNodeContentComponent}
                            {...props}
                        >
                            {children}
                        </TreeNode>
                    ))}
                </List>
            </Fragment>
        )}
    </TreeController>
);

EditableTree.propTypes = {
    ...Tree.propTypes,
    submitOnEnter: PropTypes.bool,
};

EditableTree.defaultProps = {
    ...Tree.defaultProps,
    submitOnEnter: true,
    dragPreviewComponent: DefaultDragPreview,
    treeNodeComponent: EditableTreeNode,
    treeNodeContentComponent: EditableTreeNodeContent,
};

export default compose(
    withStyles(styles),
    DragDropContext(HTML5Backend)
)(EditableTree);
