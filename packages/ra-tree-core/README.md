# ra-tree-core

A component to display hierarchized data in [react-admin](https://github.com/marmelab/react-admin). This package is UI agnostic. It provides redux actions, reducers and a component using render prop.

## Installation

```sh
npm install --save ra-tree-core
# or
yarn add ra-tree-core
```

## Usage

With a categories ressource having this structure where a category may have a parent category referenced by the `parent_id` field:

```json
[
    { "id": 1, "name": "Clothing" },
    { "id": 2, "name": "Men", "parent_id": 1 },
    { "id": 3, "name": "Suits", "parent_id": 2 },
    { "id": 4, "name": "Slacks", "parent_id": 3 },
    { "id": 5, "name": "Jackets", "parent_id": 3 },
    { "id": 6, "name": "Women", "parent_id": 1 },
    { "id": 7, "name": "Dresses", "parent_id": 6 },
    { "id": 8, "name": "Evening Gowns", "parent_id": 7 },
    { "id": 9, "name": "Sun Dresses", "parent_id": 7 },
    { "id": 10, "name": "Skirts", "parent_id": 6 },
    { "id": 11, "name": "Blouses", "parent_id": 6 }
]
```

```js
import React from 'react';
import {
    List,
    TextField,
} from 'react-admin';
import { TreeController } from 'ra-tree-core';
import TreeNode from './TreeNode';

export const CategoriesList = (props) => (
    <List {...props}>
        <TreeController>
            {props => (
                <TreeNode {...props} />
            )}
        </TreeController>
    </List>
);
```

`react-admin` will fetch the data and the `TreeController` component will build a tree from it. Note that every category which do not have a parent will be considered a root node. The `TreeController` component will call its children function which is responsible for the actual rendering.

## API

### <TreeController>

The `TreeController` accepts the following props:

- `parentSource`: The field used as the parent identifier for each node. Defaults to `parent_id`
- `getTreeFromArray`: The function used to build the tree from the fetched data. It defaults to one using [performant-array-to-tree](https://github.com/philipstanislaus/performant-array-to-tree)
- `getTreeState`: A function which must return the tree state root from the redux state in case you mounted it on a key different key than `tree`. It will be called with a single `state` argument which is the redux state.
- `children`: A function will be called with following props
  - `tree`: an array of the root nodes. Each node will have two properties in addition of the resource data, `__children`, an array of its child nodes, and `__depth`, a number indicating its depth in the hierarchy
  - `ids`: An array of the all the data items identifiers
  - `data`: An object containing the fetched data, where an item identifier its the key
  - `parentSource`: The field used as the parent identifier for each node

### TreeContext

A React [`Context`](https://reactjs.org/docs/context.html) allowing us to avoid passing everything trough props. It provides a single object value containing the following properties:

- `getIsNodeExpanded`: a function which takes a node identifier as its only parameter and returns a boolean indicating whether this node is expanded.
- `toggleNode`: a function which takes a node identifier and toggle its expanded state

Under the hood, it store the expanded state of all nodes in redux and dispatch the appropriate actions when calling `toggleNode`, avoiding you to connect your components by yourself.

To use it, you must first register the provided reducer:

```js
// in App.js
import React from 'react';
import { Admin, Resource } from 'react-admin';
import { reducer as tree } from 'ra-tree-ui-materialui';

import dataProvider from './dataProvider';
import posts from './posts';
import tags from './tags';

const App = () => (
    <Admin
        dataProvider={dataProvider}
        locale="en"
        customReducers={{ tree }}
    >
        <Resource name="posts" {...posts} />
        <Resource name="tags" {...tags} />
    </Admin>
)
```

You can then wrap your `TreeNode` component with the `TreeContext.Consumer` component:

```js
// in src/TreeNode.js
import React, { Component } from 'react';
import { TreeContext } from 'ra-tree-core';

class TreeNodeView extends Component {
    handleToggle = () => {
        this.props.toggleNode(this.props.node.id);
    }

    render() {
        const { isExpanded, node, toggleNode, ...props } = this.props;
        const prefix = Array
            .from(Array(node.__depth).keys())
            .reduce((acc, index) => `${acc}|--`, '');

        return (
            <div {...props}>
                {prefix}{node.name}
                <button onClick={this.handleToggle}>
                    {isExpanded ? '-' : '+'}
                </button>
                {isExpanded
                    ? node.__children.map(child => (
                        <TreeNode {...props} node={child} />
                    ))
                    : null
                }
            </div>
        );
    }
}

const TreeNode = props => (
    <TreeContext.Consumer>
        {({ getIsNodeExpanded, toggleNode }) => (
            <TreeNodeView
                {...props}
                isExpanded={getIsNodeExpanded(props.node.id)}
                toggleNode={toggleNode}
            />
        )}
    </TreeContext.Consumer>
);

export default TreeNode;
```

## Roadmap

- Support nested set hierarchical data
- `TreeSelectInputController` to select a value inside the hierarchical data (with autocomplete showing the matched nodes)
- `TreeInputController` to edit a field containing hierarchical data as json
- `TreeNodeFieldController` to show a node and its hierarchie. It should recursively fetch the parents by default, allow a custom function to be supplied to fetch them in one call (`fetchHierarchy`).

## License

This library is licensed under the MIT License, and sponsored by [marmelab](http://marmelab.com).
