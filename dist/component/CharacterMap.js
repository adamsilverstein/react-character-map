'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _chars = require('./chars.json');

var _chars2 = _interopRequireDefault(_chars);

require('./style.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * <CharacterMap /> Element
 *
 * @example <CharacterMap onSelect={function(char,el){ console.log(char, el); }} />
 * @extends React
 */
var CharacterMap = function (_React$Component) {
    _inherits(CharacterMap, _React$Component);

    function CharacterMap(props) {
        _classCallCheck(this, CharacterMap);

        var _this = _possibleConstructorReturn(this, (CharacterMap.__proto__ || Object.getPrototypeOf(CharacterMap)).call(this, props));

        _this.state = {
            active: 0,
            search: '',
            categoryList: '',
            charList: '',
            fullCharList: ''
        };
        _this.resultsCache = [];
        _this.handleSearchChange = _this.handleSearchChange.bind(_this);
        return _this;
    }

    _createClass(CharacterMap, [{
        key: 'clickCategoryHandler',
        value: function clickCategoryHandler(e) {
            var cat = e.target.getAttribute('data-category-index');
            this.setState({ active: cat });
        }

        // Run the callback function

    }, {
        key: 'charClickHandler',
        value: function charClickHandler(e, char) {
            e.preventDefault();
            return this.props.onSelect(char, e.target);
        }

        // Perform the search

    }, {
        key: 'performSearch',
        value: function performSearch(search) {
            var characterData = this.props.characterData;

            var characters = characterData || _chars2.default;
            var filteredCharacters = { 'Results': [] };
            var sortedResults = [];
            Object.keys(characters).forEach(function (group) {
                Object.keys(characters[group]).forEach(function (character) {
                    if (!characters[group][character].name) {
                        return;
                    }
                    // If search string is one character long, look for names that start with that character.
                    if (1 === search.length) {
                        if (0 === characters[group][character].name.toLowerCase().indexOf(search.toLowerCase())) {
                            filteredCharacters['Results'].push(characters[group][character]);
                        }
                    } else {

                        // When the search string is two or more characters, do a full search of the name.
                        var index = characters[group][character].name.toLowerCase().indexOf(search.toLowerCase());
                        if (-1 !== index) {
                            // Store the results in a sorted array of buckets based on search result index.
                            // Matches with index of 20 or more are stored in the final bucket.
                            var sortPosition = index < 20 ? index : 20;
                            sortedResults[index] = sortedResults[index] || [];
                            sortedResults[index].push(characters[group][character]);
                        }
                    }
                });
            });

            // If we built a sorted array, map that to filteredCharacters, preserving the sert order.
            if (0 !== sortedResults.length) {
                sortedResults.forEach(function (results) {
                    results.forEach(function (result) {
                        filteredCharacters['Results'].push(result);
                    });
                });
            }

            return filteredCharacters;
        }

        // Filter the displayed characters.

    }, {
        key: 'handleSearchChange',
        value: function handleSearchChange(e) {
            var search = e.target.value;
            var _state = this.state,
                fullCharList = _state.fullCharList,
                charList = _state.charList;

            if ('' === search) {
                this.setState({ charList: fullCharList });
            } else {
                var filteredCharacters = this.resultsCache[search] ? this.resultsCache[search] : this.performSearch(search);
                this.resultsCache[search] = filteredCharacters;

                var _charListFromCharacte = this.charListFromCharacters(filteredCharacters),
                    _charList = _charListFromCharacte.charList;

                this.setState({ charList: _charList });
            }
            this.setState({ search: search });
        }
    }, {
        key: 'charListFromCharacters',
        value: function charListFromCharacters(characters) {
            var self = this;
            var categoryList = [];
            var i = -1;

            // Loop through each category
            var charList = Object.keys(characters).map(function (category, current) {
                i++;

                if (parseInt(self.state.active, 10) === i) {
                    // In the active category, loop through the characters and create the list
                    var currentItems = Object.keys(characters[category]).map(function (p, c) {
                        return _react2.default.createElement(
                            'li',
                            { key: 'topli' + p },
                            _react2.default.createElement(
                                'button',
                                {
                                    'data-hex': characters[category][p].hex,
                                    'data-entity': characters[category][p].entity,
                                    'data-char': characters[category][p].char,
                                    'data-title': characters[category][p].name,
                                    onClick: function onClick(e) {
                                        return self.charClickHandler(e, characters[category][p]);
                                    }
                                },
                                characters[category][p].char
                            )
                        );
                    });
                }

                categoryList.push(_react2.default.createElement(
                    'li',
                    { key: 'clli' + category + i, className: "charMap--category-menu-item" + (parseInt(self.state.active, 10) === i ? ' active' : '') },
                    _react2.default.createElement(
                        'button',
                        {
                            'data-category-index': i,
                            onClick: self.clickCategoryHandler.bind(self)
                        },
                        category
                    )
                ));

                return _react2.default.createElement(
                    'li',
                    { key: 'innerli' + category + i,
                        'data-category-name': category
                    },
                    _react2.default.createElement(
                        'ul',
                        {
                            className: "charMap--category " + (parseInt(self.state.active, 10) === i ? ' active' : '')
                        },
                        currentItems
                    )
                );
            });
            return { charList: charList, categoryList: categoryList };
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var characterData = this.props.characterData;

            var characters = characterData || _chars2.default;

            var _charListFromCharacte2 = this.charListFromCharacters(characters),
                charList = _charListFromCharacte2.charList,
                categoryList = _charListFromCharacte2.categoryList;

            this.setState({ charList: charList, categoryList: categoryList, fullCharList: charList });
        }
    }, {
        key: 'render',
        value: function render() {
            var _state2 = this.state,
                categoryList = _state2.categoryList,
                charList = _state2.charList,
                search = _state2.search;


            return _react2.default.createElement(
                'div',
                { className: 'charMap--container' },
                _react2.default.createElement(
                    'ul',
                    { className: 'charMap--category-menu', 'aria-label': 'Categories' },
                    _react2.default.createElement(
                        'label',
                        { 'for': 'filter' },
                        'Filter: '
                    ),
                    _react2.default.createElement('input', {
                        type: 'text',
                        name: 'filter',
                        'aria-label': 'Filter',
                        value: search,
                        onChange: this.handleSearchChange,
                        autoComplete: false
                    })
                ),
                '' === search && _react2.default.createElement(
                    'ul',
                    { className: 'charMap--category-menu' },
                    categoryList
                ),
                _react2.default.createElement(
                    'ul',
                    { className: 'charMap--categories', 'aria-label': 'Character List' },
                    charList
                )
            );
        }
    }]);

    return CharacterMap;
}(_react2.default.Component);

exports.default = CharacterMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnQvQ2hhcmFjdGVyTWFwLmpzIl0sIm5hbWVzIjpbIkNoYXJhY3Rlck1hcCIsInByb3BzIiwic3RhdGUiLCJhY3RpdmUiLCJzZWFyY2giLCJjYXRlZ29yeUxpc3QiLCJjaGFyTGlzdCIsImZ1bGxDaGFyTGlzdCIsInJlc3VsdHNDYWNoZSIsImhhbmRsZVNlYXJjaENoYW5nZSIsImJpbmQiLCJlIiwiY2F0IiwidGFyZ2V0IiwiZ2V0QXR0cmlidXRlIiwic2V0U3RhdGUiLCJjaGFyIiwicHJldmVudERlZmF1bHQiLCJvblNlbGVjdCIsImNoYXJhY3RlckRhdGEiLCJjaGFyYWN0ZXJzIiwiQ2hhcnMiLCJmaWx0ZXJlZENoYXJhY3RlcnMiLCJzb3J0ZWRSZXN1bHRzIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJncm91cCIsImNoYXJhY3RlciIsIm5hbWUiLCJsZW5ndGgiLCJ0b0xvd2VyQ2FzZSIsImluZGV4T2YiLCJwdXNoIiwiaW5kZXgiLCJzb3J0UG9zaXRpb24iLCJyZXN1bHRzIiwicmVzdWx0IiwidmFsdWUiLCJwZXJmb3JtU2VhcmNoIiwiY2hhckxpc3RGcm9tQ2hhcmFjdGVycyIsInNlbGYiLCJpIiwibWFwIiwiY2F0ZWdvcnkiLCJjdXJyZW50IiwicGFyc2VJbnQiLCJjdXJyZW50SXRlbXMiLCJwIiwiYyIsImhleCIsImVudGl0eSIsImNoYXJDbGlja0hhbmRsZXIiLCJjbGlja0NhdGVnb3J5SGFuZGxlciIsIlJlYWN0IiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBOzs7Ozs7SUFNTUEsWTs7O0FBQ0YsMEJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxnSUFDVEEsS0FEUzs7QUFFZixjQUFLQyxLQUFMLEdBQWE7QUFDVEMsb0JBQVEsQ0FEQztBQUVUQyxvQkFBUSxFQUZDO0FBR1RDLDBCQUFjLEVBSEw7QUFJVEMsc0JBQVUsRUFKRDtB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RWhCLGdCQUFJQyxhQUFhRCxpQkFBaUJFLGVBQWxDOztBQUZnQix5Q0FHZ0IsS0FBS21CLHNCQUFMLENBQTRCcEIsVUFBNUIsQ0FIaEI7QUFBQSxnQkFHVGQsUUFIUywwQkFHVEEsUUFIUztBQUFBLGdCQUdBRCxZQUhBLDBCQUdBQSxZQUhBOztBQUloQixpQkFBS1UsUUFBTCxDQUFjLEVBQUNULGtCQUFELEVBQVVELDBCQUFWLEVBQXVCRSxjQUFjRCxRQUFyQyxFQUFkO0FBQ0g7OztpQ0FFUTtBQUFBLDBCQUNrQyxLQUFLSixLQUR2QztBQUFBLGdCQUNFRyxZQURGLFdBQ0VBLFlBREY7QUFBQSxnQkFDZUMsUUFEZixXQUNlQSxRQURmO0FBQUEsZ0JBQ3dCRixNQUR4QixXQUN3QkEsTUFEeEI7OztBQUdMLG1CQUNJO0FBQUE7QUFBQSxrQkFBSyxXQUFVLG9CQUFmO0FBQ0k7QUFBQTtBQUFBLHNCQUFJLFdBQVUsd0JBQWQsRUFBdUMsY0FBVyxZQUFsRDtBQUNJO0FBQUE7QUFBQSwwQkFBTyxPQUFJLFFBQVg7QUFBQTtBQUFBLHFCQURKO0FBRUk7QUFDSSw4QkFBSyxNQURUO0FBRUksOEJBQUssUUFGVDtBQUdJLHNDQUFXLFFBSGY7QUFJSSwrQkFBT0EsTUFKWDtBQUtJLGtDQUFVLEtBQUtLLGtCQUxuQjtBQU1JLHNDQUFjO0FBTmxCO0FBRkosaUJBREo7QUFZTSx1QkFBT0wsTUFBUCxJQUNFO0FBQUE7QUFBQSxzQkFBSSxXQUFVLHdCQUFkO0FBQ01DO0FBRE4saUJBYlI7QUFpQkk7QUFBQTtBQUFBLHNCQUFJLFdBQVUscUJBQWQsRUFBb0MsY0FBVyxnQkFBL0M7QUFDTUM7QUFETjtBQWpCSixhQURKO0FBdUJIOzs7O0VBdEtzQmdELGdCQUFNQyxTOztrQkF5S2xCdkQsWSIsImZpbGUiOiJDaGFyYWN0ZXJNYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IENoYXJzIGZyb20gJy4vY2hhcnMuanNvbic7XG5pbXBvcnQgJy4vc3R5bGUuY3NzJztcblxuLyoqXG4gKiA8Q2hhcmFjdGVyTWFwIC8+IEVsZW1lbnRcbiAqXG4gKiBAZXhhbXBsZSA8Q2hhcmFjdGVyTWFwIG9uU2VsZWN0PXtmdW5jdGlvbihjaGFyLGVsKXsgY29uc29sZS5sb2coY2hhciwgZWwpOyB9fSAvPlxuICogQGV4dGVuZHMgUmVhY3RcbiAqL1xuY2xhc3MgQ2hhcmFjdGVyTWFwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBhY3RpdmU6IDAsXG4gICAgICAgICAgICBzZWFyY2g6ICcnLFxuICAgICAgICAgICAgY2F0ZWdvcnlMaXN0OiAnJyxcbiAgICAgICAgICAgIGNoYXJMaXN0OiAnJyxcbiAgICAgICAgICAgIGZ1bGxDaGFyTGlzdDogJycsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucmVzdWx0c0NhY2hlPVtdO1xuICAgICAgICB0aGlzLmhhbmRsZVNlYXJjaENoYW5nZSA9IHRoaXMuaGFuZGxlU2VhcmNoQ2hhbmdlLmJpbmQoIHRoaXMgKTtcbiAgICB9XG5cbiAgICBjbGlja0NhdGVnb3J5SGFuZGxlcihlKSB7XG4gICAgICAgIHZhciBjYXQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2F0ZWdvcnktaW5kZXgnKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFjdGl2ZTogY2F0IH0pO1xuICAgIH1cblxuICAgIC8vIFJ1biB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICBjaGFyQ2xpY2tIYW5kbGVyKGUsIGNoYXIpe1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLm9uU2VsZWN0KGNoYXIsIGUudGFyZ2V0KTtcbiAgICB9XG5cbiAgICAvLyBQZXJmb3JtIHRoZSBzZWFyY2hcbiAgICBwZXJmb3JtU2VhcmNoKHNlYXJjaCkge1xuICAgICAgICB2YXIge2NoYXJhY3RlckRhdGF9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgdmFyIGNoYXJhY3RlcnMgPSBjaGFyYWN0ZXJEYXRhIHx8IENoYXJzO1xuICAgICAgICB2YXIgZmlsdGVyZWRDaGFyYWN0ZXJzID0geydSZXN1bHRzJzogW119O1xuICAgICAgICB2YXIgc29ydGVkUmVzdWx0cyA9IFtdO1xuICAgICAgICBPYmplY3Qua2V5cyhjaGFyYWN0ZXJzKS5mb3JFYWNoKGdyb3VwID0+IHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGNoYXJhY3RlcnNbZ3JvdXBdKS5mb3JFYWNoKGNoYXJhY3RlciA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFjaGFyYWN0ZXJzW2dyb3VwXVtjaGFyYWN0ZXJdLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJZiBzZWFyY2ggc3RyaW5nIGlzIG9uZSBjaGFyYWN0ZXIgbG9uZywgbG9vayBmb3IgbmFtZXMgdGhhdCBzdGFydCB3aXRoIHRoYXQgY2hhcmFjdGVyLlxuICAgICAgICAgICAgICAgIGlmICgxPT09c2VhcmNoLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoMCA9PT0gY2hhcmFjdGVyc1tncm91cF1bY2hhcmFjdGVyXS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2gudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkQ2hhcmFjdGVyc1snUmVzdWx0cyddLnB1c2goY2hhcmFjdGVyc1tncm91cF1bY2hhcmFjdGVyXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gdGhlIHNlYXJjaCBzdHJpbmcgaXMgdHdvIG9yIG1vcmUgY2hhcmFjdGVycywgZG8gYSBmdWxsIHNlYXJjaCBvZiB0aGUgbmFtZS5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gY2hhcmFjdGVyc1tncm91cF1bY2hhcmFjdGVyXS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2gudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICgtMSAhPT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN0b3JlIHRoZSByZXN1bHRzIGluIGEgc29ydGVkIGFycmF5IG9mIGJ1Y2tldHMgYmFzZWQgb24gc2VhcmNoIHJlc3VsdCBpbmRleC5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1hdGNoZXMgd2l0aCBpbmRleCBvZiAyMCBvciBtb3JlIGFyZSBzdG9yZWQgaW4gdGhlIGZpbmFsIGJ1Y2tldC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzb3J0UG9zaXRpb24gPSBpbmRleCA8IDIwID8gaW5kZXggOiAyMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRlZFJlc3VsdHNbaW5kZXhdID0gc29ydGVkUmVzdWx0c1tpbmRleF0gfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0ZWRSZXN1bHRzW2luZGV4XS5wdXNoKGNoYXJhY3RlcnNbZ3JvdXBdW2NoYXJhY3Rlcl0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApO1xuICAgICAgICB9ICk7XG5cbiAgICAgICAgLy8gSWYgd2UgYnVpbHQgYSBzb3J0ZWQgYXJyYXksIG1hcCB0aGF0IHRvIGZpbHRlcmVkQ2hhcmFjdGVycywgcHJlc2VydmluZyB0aGUgc2VydCBvcmRlci5cbiAgICAgICAgaWYgKDAgIT09IHNvcnRlZFJlc3VsdHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzb3J0ZWRSZXN1bHRzLmZvckVhY2goZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgICAgICAgICAgIHJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRDaGFyYWN0ZXJzWydSZXN1bHRzJ10ucHVzaChyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZENoYXJhY3RlcnM7XG4gICAgfVxuXG4gICAgLy8gRmlsdGVyIHRoZSBkaXNwbGF5ZWQgY2hhcmFjdGVycy5cbiAgICBoYW5kbGVTZWFyY2hDaGFuZ2UoIGUgKSB7XG4gICAgICAgIGNvbnN0IHNlYXJjaCA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICBjb25zdCB7ZnVsbENoYXJMaXN0LGNoYXJMaXN0fSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIGlmICgnJyA9PT0gc2VhcmNoKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtjaGFyTGlzdDogZnVsbENoYXJMaXN0fSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZENoYXJhY3RlcnMgPSB0aGlzLnJlc3VsdHNDYWNoZVtzZWFyY2hdID8gdGhpcy5yZXN1bHRzQ2FjaGVbc2VhcmNoXSA6IHRoaXMucGVyZm9ybVNlYXJjaChzZWFyY2gpO1xuICAgICAgICAgICAgdGhpcy5yZXN1bHRzQ2FjaGVbc2VhcmNoXSA9IGZpbHRlcmVkQ2hhcmFjdGVycztcbiAgICAgICAgICAgIGNvbnN0IHtjaGFyTGlzdH0gPSB0aGlzLmNoYXJMaXN0RnJvbUNoYXJhY3RlcnMoZmlsdGVyZWRDaGFyYWN0ZXJzKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2NoYXJMaXN0fSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c2VhcmNofSk7XG4gICAgfVxuXG4gICAgY2hhckxpc3RGcm9tQ2hhcmFjdGVycyhjaGFyYWN0ZXJzKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGNhdGVnb3J5TGlzdCA9IFtdO1xuICAgICAgICB2YXIgaSA9IC0xO1xuXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCBlYWNoIGNhdGVnb3J5XG4gICAgICAgIHZhciBjaGFyTGlzdCA9IE9iamVjdC5rZXlzKGNoYXJhY3RlcnMpLm1hcChmdW5jdGlvbihjYXRlZ29yeSwgY3VycmVudCkge1xuICAgICAgICAgICAgaSsrO1xuXG4gICAgICAgICAgICBpZiAoIHBhcnNlSW50KHNlbGYuc3RhdGUuYWN0aXZlLDEwKSA9PT0gaSApIHtcbiAgICAgICAgICAgICAgICAvLyBJbiB0aGUgYWN0aXZlIGNhdGVnb3J5LCBsb29wIHRocm91Z2ggdGhlIGNoYXJhY3RlcnMgYW5kIGNyZWF0ZSB0aGUgbGlzdFxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50SXRlbXMgPSBPYmplY3Qua2V5cyhjaGFyYWN0ZXJzW2NhdGVnb3J5XSkubWFwKGZ1bmN0aW9uKHAsYyl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoPGxpIGtleT17J3RvcGxpJyArIHB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtaGV4PXtjaGFyYWN0ZXJzW2NhdGVnb3J5XVtwXS5oZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1lbnRpdHk9e2NoYXJhY3RlcnNbY2F0ZWdvcnldW3BdLmVudGl0eX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLWNoYXI9e2NoYXJhY3RlcnNbY2F0ZWdvcnldW3BdLmNoYXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10aXRsZT17Y2hhcmFjdGVyc1tjYXRlZ29yeV1bcF0ubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsgKChlKSA9PiBzZWxmLmNoYXJDbGlja0hhbmRsZXIoZSxjaGFyYWN0ZXJzW2NhdGVnb3J5XVtwXSkpIH1cbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Y2hhcmFjdGVyc1tjYXRlZ29yeV1bcF0uY2hhcn1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhdGVnb3J5TGlzdC5wdXNoKCg8bGkga2V5PXsnY2xsaScgKyBjYXRlZ29yeSArIGl9IGNsYXNzTmFtZT17XCJjaGFyTWFwLS1jYXRlZ29yeS1tZW51LWl0ZW1cIiArIChwYXJzZUludChzZWxmLnN0YXRlLmFjdGl2ZSwxMCkgPT09IGkgPyAnIGFjdGl2ZScgOiAnJyl9PlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgZGF0YS1jYXRlZ29yeS1pbmRleD17aX1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17IHNlbGYuY2xpY2tDYXRlZ29yeUhhbmRsZXIuYmluZChzZWxmKSB9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7Y2F0ZWdvcnl9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2xpPikpO1xuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxsaSBrZXk9eydpbm5lcmxpJyArIGNhdGVnb3J5ICsgaX1cbiAgICAgICAgICAgICAgICAgICAgZGF0YS1jYXRlZ29yeS1uYW1lPXtjYXRlZ29yeX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDx1bFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtcImNoYXJNYXAtLWNhdGVnb3J5IFwiICsgKHBhcnNlSW50KHNlbGYuc3RhdGUuYWN0aXZlLDEwKSA9PT0gaSA/ICcgYWN0aXZlJyA6ICcnKX1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7Y3VycmVudEl0ZW1zfVxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge2NoYXJMaXN0LGNhdGVnb3J5TGlzdH07XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHZhciB7IGNoYXJhY3RlckRhdGEgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHZhciBjaGFyYWN0ZXJzID0gY2hhcmFjdGVyRGF0YSB8fCBDaGFycztcbiAgICAgICAgY29uc3Qge2NoYXJMaXN0LGNhdGVnb3J5TGlzdH0gPSB0aGlzLmNoYXJMaXN0RnJvbUNoYXJhY3RlcnMoY2hhcmFjdGVycyk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2NoYXJMaXN0LGNhdGVnb3J5TGlzdCxmdWxsQ2hhckxpc3Q6IGNoYXJMaXN0fSk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7Y2F0ZWdvcnlMaXN0LGNoYXJMaXN0LHNlYXJjaH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYXJNYXAtLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJjaGFyTWFwLS1jYXRlZ29yeS1tZW51XCIgYXJpYS1sYWJlbD1cIkNhdGVnb3JpZXNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImZpbHRlclwiPkZpbHRlcjogPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lPVwiZmlsdGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJGaWx0ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NlYXJjaH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVNlYXJjaENoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9Db21wbGV0ZT17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICB7ICcnID09PSBzZWFyY2ggJiZcbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImNoYXJNYXAtLWNhdGVnb3J5LW1lbnVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsgY2F0ZWdvcnlMaXN0fVxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiY2hhck1hcC0tY2F0ZWdvcmllc1wiIGFyaWEtbGFiZWw9XCJDaGFyYWN0ZXIgTGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICB7IGNoYXJMaXN0IH1cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYXJhY3Rlck1hcDtcbiJdfQ==