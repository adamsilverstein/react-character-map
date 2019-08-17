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
            fullCharList: '',
            update: 1
        };
        _this.resultsCache = [];
        _this.handleSearchChange = _this.handleSearchChange.bind(_this);
        _this.clickCategoryHandler = _this.clickCategoryHandler.bind(_this);
        _this.setupCharacters = _this.setupCharacters.bind(_this);
        return _this;
    }

    /**
     * Handle clicks to the category tabs.
     *
     * @param {Event} e The React synthetic event.
     */


    _createClass(CharacterMap, [{
        key: 'clickCategoryHandler',
        value: function clickCategoryHandler(e) {
            console.log('clickCategoryHandler');
            var cat = e.target.getAttribute('data-category-index');
            this.setupCharacters(cat);
        }

        /**
         * Extract character data at a tab.
         *
         * @param {Number} tab The tab to display.
         */

    }, {
        key: 'setupCharacters',
        value: function setupCharacters(tab) {
            var characterData = this.props.characterData;

            var characters = characterData || _chars2.default;

            var _charListFromCharacte = this.charListFromCharacters(characters, tab),
                charList = _charListFromCharacte.charList,
                categoryList = _charListFromCharacte.categoryList;

            this.setState({ charList: charList, categoryList: categoryList, fullCharList: charList });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.setupCharacters(0);
        }

        // Handle clicks to the characters, running callback function.

    }, {
        key: 'charClickHandler',
        value: function charClickHandler(e, char) {
            e.preventDefault();
            return this.props.onSelect(char, e.target);
        }

        /**
         * Perform the character search.
         *
         * @param {string} search The search string.
         */

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

                var _charListFromCharacte2 = this.charListFromCharacters(filteredCharacters, 0),
                    _charList = _charListFromCharacte2.charList;

                this.setState({ charList: _charList });
            }
            this.setState({ search: search });
        }
    }, {
        key: 'charListFromCharacters',
        value: function charListFromCharacters(characters, active) {
            var self = this;
            var categoryList = [];
            var i = -1;
            self.activeTab = parseInt(active, 10);
            console.log('active in charlistfromcharacters', active);

            // Loop through each category
            var charList = Object.keys(characters).map(function (category) {
                i++;

                if (self.activeTab === i) {
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
                    { key: 'clli' + category + i, className: "charMap--category-menu-item" + (self.activeTab === i ? ' active' : '') },
                    _react2.default.createElement(
                        'button',
                        {
                            'data-category-index': i,
                            onClick: self.clickCategoryHandler
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
                            className: "charMap--category " + (self.activeTab === i ? ' active' : '')
                        },
                        currentItems
                    )
                );
            });
            return { charList: charList, categoryList: categoryList };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnQvQ2hhcmFjdGVyTWFwLmpzIl0sIm5hbWVzIjpbIkNoYXJhY3Rlck1hcCIsInByb3BzIiwic3RhdGUiLCJhY3RpdmUiLCJzZWFyY2giLCJjYXRlZ29yeUxpc3QiLCJjaGFyTGlzdCIsImZ1bGxDaGFyTGlzdCIsInVwZGF0ZSIsInJlc3VsdHNDYWNoZSIsImhhbmRsZVNlYXJjaENoYW5nZSIsImJpbmQiLCJjbGlja0NhdGVnb3J5SGFuZGxlciIsInNldHVwQ2hhcmFjdGVycyIsImUiLCJjb25zb2xlIiwibG9nIiwiY2F0IiwidGFyZ2V0IiwiZ2V0QXR0cmlidXRlIiwidGFiIiwiY2hhcmFjdGVyRGF0YSIsImNoYXJhY3RlcnMiLCJDaGFycyIsImNoYXJMaXN0RnJvbUNoYXJhY3RlcnMiLCJzZXRTdGF0ZSIsImNoYXIiLCJwcmV2ZW50RGVmYXVsdCIsIm9uU2VsZWN0IiwiZmlsdGVyZWRDaGFyYWN0ZXJzIiwic29ydGVkUmVzdWx0cyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwiZ3JvdXAiLCJjaGFyYWN0ZXIiLCJuYW1lIiwibGVuZ3RoIiwidG9Mb3dlckNhc2UiLCJpbmRleE9mIiwicHVzaCIsImluZGV4Iiwic29ydFBvc2l0aW9uIiwicmVzdWx0cyIsInJlc3VsdCIsInZhbHVlIiwicGVyZm9ybVNlYXJjaCIsInNlbGYiLCJpIiwiYWN0aXZlVGFiIiwicGFyc2VJbnQiLCJtYXAiLCJjYXRlZ29yeSIsImN1cnJlbnRJdGVtcyIsInAiLCJjIiwiaGV4IiwiZW50aXR5IiwiY2hhckNsaWNrSGFuZGxlciIsIlJlYWN0IiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBOzs7Ozs7SUFNTUEsWTs7O0FBQ0YsMEJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxnSUFDVEEsS0FEUzs7QUFFZixjQUFLQyxLQUFMLEdBQWE7QUFDVEMsb0JBQVEsQ0FEQztB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QUFkO0FBQ01DO0FBRE4saUJBYlI7QUFpQkk7QUFBQTtBQUFBLHNCQUFJLFdBQVUscUJBQWQsRUFBb0MsY0FBVyxnQkFBL0M7QUFDTUM7QUFETjtBQWpCSixhQURKO0FBdUJIOzs7O0VBN0xzQnFELGdCQUFNQyxTOztrQkFnTWxCNUQsWSIsImZpbGUiOiJDaGFyYWN0ZXJNYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IENoYXJzIGZyb20gJy4vY2hhcnMuanNvbic7XG5pbXBvcnQgJy4vc3R5bGUuY3NzJztcblxuLyoqXG4gKiA8Q2hhcmFjdGVyTWFwIC8+IEVsZW1lbnRcbiAqXG4gKiBAZXhhbXBsZSA8Q2hhcmFjdGVyTWFwIG9uU2VsZWN0PXtmdW5jdGlvbihjaGFyLGVsKXsgY29uc29sZS5sb2coY2hhciwgZWwpOyB9fSAvPlxuICogQGV4dGVuZHMgUmVhY3RcbiAqL1xuY2xhc3MgQ2hhcmFjdGVyTWFwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBhY3RpdmU6IDAsXG4gICAgICAgICAgICBzZWFyY2g6ICcnLFxuICAgICAgICAgICAgY2F0ZWdvcnlMaXN0OiAnJyxcbiAgICAgICAgICAgIGNoYXJMaXN0OiAnJyxcbiAgICAgICAgICAgIGZ1bGxDaGFyTGlzdDogJycsXG4gICAgICAgICAgICB1cGRhdGU6IDEsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucmVzdWx0c0NhY2hlPVtdO1xuICAgICAgICB0aGlzLmhhbmRsZVNlYXJjaENoYW5nZSA9IHRoaXMuaGFuZGxlU2VhcmNoQ2hhbmdlLmJpbmQoIHRoaXMgKTtcbiAgICAgICAgdGhpcy5jbGlja0NhdGVnb3J5SGFuZGxlciA9IHRoaXMuY2xpY2tDYXRlZ29yeUhhbmRsZXIuYmluZCggdGhpcyApO1xuICAgICAgICB0aGlzLnNldHVwQ2hhcmFjdGVycyA9IHRoaXMuc2V0dXBDaGFyYWN0ZXJzLmJpbmQoIHRoaXMgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgY2xpY2tzIHRvIHRoZSBjYXRlZ29yeSB0YWJzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFdmVudH0gZSBUaGUgUmVhY3Qgc3ludGhldGljIGV2ZW50LlxuICAgICAqL1xuICAgIGNsaWNrQ2F0ZWdvcnlIYW5kbGVyKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coICdjbGlja0NhdGVnb3J5SGFuZGxlcicgKTtcbiAgICAgICAgdmFyIGNhdCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1jYXRlZ29yeS1pbmRleCcpO1xuICAgICAgICB0aGlzLnNldHVwQ2hhcmFjdGVycyggY2F0ICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXh0cmFjdCBjaGFyYWN0ZXIgZGF0YSBhdCBhIHRhYi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0YWIgVGhlIHRhYiB0byBkaXNwbGF5LlxuICAgICAqL1xuICAgIHNldHVwQ2hhcmFjdGVycyggdGFiICkge1xuICAgICAgICB2YXIgeyBjaGFyYWN0ZXJEYXRhIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICB2YXIgY2hhcmFjdGVycyA9IGNoYXJhY3RlckRhdGEgfHwgQ2hhcnM7XG4gICAgICAgIGNvbnN0IHtjaGFyTGlzdCxjYXRlZ29yeUxpc3R9ID0gdGhpcy5jaGFyTGlzdEZyb21DaGFyYWN0ZXJzKGNoYXJhY3RlcnMsIHRhYik7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2NoYXJMaXN0LGNhdGVnb3J5TGlzdCxmdWxsQ2hhckxpc3Q6IGNoYXJMaXN0fSk7XG4gICAgfVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgIHRoaXMuc2V0dXBDaGFyYWN0ZXJzKCAwICk7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIGNsaWNrcyB0byB0aGUgY2hhcmFjdGVycywgcnVubmluZyBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICBjaGFyQ2xpY2tIYW5kbGVyKGUsIGNoYXIpe1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLm9uU2VsZWN0KGNoYXIsIGUudGFyZ2V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtIHRoZSBjaGFyYWN0ZXIgc2VhcmNoLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlYXJjaCBUaGUgc2VhcmNoIHN0cmluZy5cbiAgICAgKi9cbiAgICBwZXJmb3JtU2VhcmNoKHNlYXJjaCkge1xuICAgICAgICB2YXIge2NoYXJhY3RlckRhdGF9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgdmFyIGNoYXJhY3RlcnMgPSBjaGFyYWN0ZXJEYXRhIHx8IENoYXJzO1xuICAgICAgICB2YXIgZmlsdGVyZWRDaGFyYWN0ZXJzID0geydSZXN1bHRzJzogW119O1xuICAgICAgICB2YXIgc29ydGVkUmVzdWx0cyA9IFtdO1xuICAgICAgICBPYmplY3Qua2V5cyhjaGFyYWN0ZXJzKS5mb3JFYWNoKGdyb3VwID0+IHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGNoYXJhY3RlcnNbZ3JvdXBdKS5mb3JFYWNoKGNoYXJhY3RlciA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFjaGFyYWN0ZXJzW2dyb3VwXVtjaGFyYWN0ZXJdLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJZiBzZWFyY2ggc3RyaW5nIGlzIG9uZSBjaGFyYWN0ZXIgbG9uZywgbG9vayBmb3IgbmFtZXMgdGhhdCBzdGFydCB3aXRoIHRoYXQgY2hhcmFjdGVyLlxuICAgICAgICAgICAgICAgIGlmICgxPT09c2VhcmNoLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoMCA9PT0gY2hhcmFjdGVyc1tncm91cF1bY2hhcmFjdGVyXS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2gudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkQ2hhcmFjdGVyc1snUmVzdWx0cyddLnB1c2goY2hhcmFjdGVyc1tncm91cF1bY2hhcmFjdGVyXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gdGhlIHNlYXJjaCBzdHJpbmcgaXMgdHdvIG9yIG1vcmUgY2hhcmFjdGVycywgZG8gYSBmdWxsIHNlYXJjaCBvZiB0aGUgbmFtZS5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gY2hhcmFjdGVyc1tncm91cF1bY2hhcmFjdGVyXS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2gudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICgtMSAhPT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN0b3JlIHRoZSByZXN1bHRzIGluIGEgc29ydGVkIGFycmF5IG9mIGJ1Y2tldHMgYmFzZWQgb24gc2VhcmNoIHJlc3VsdCBpbmRleC5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1hdGNoZXMgd2l0aCBpbmRleCBvZiAyMCBvciBtb3JlIGFyZSBzdG9yZWQgaW4gdGhlIGZpbmFsIGJ1Y2tldC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzb3J0UG9zaXRpb24gPSBpbmRleCA8IDIwID8gaW5kZXggOiAyMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRlZFJlc3VsdHNbaW5kZXhdID0gc29ydGVkUmVzdWx0c1tpbmRleF0gfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0ZWRSZXN1bHRzW2luZGV4XS5wdXNoKGNoYXJhY3RlcnNbZ3JvdXBdW2NoYXJhY3Rlcl0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSApO1xuICAgICAgICB9ICk7XG5cbiAgICAgICAgLy8gSWYgd2UgYnVpbHQgYSBzb3J0ZWQgYXJyYXksIG1hcCB0aGF0IHRvIGZpbHRlcmVkQ2hhcmFjdGVycywgcHJlc2VydmluZyB0aGUgc2VydCBvcmRlci5cbiAgICAgICAgaWYgKDAgIT09IHNvcnRlZFJlc3VsdHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzb3J0ZWRSZXN1bHRzLmZvckVhY2goZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgICAgICAgICAgIHJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRDaGFyYWN0ZXJzWydSZXN1bHRzJ10ucHVzaChyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZENoYXJhY3RlcnM7XG4gICAgfVxuXG4gICAgLy8gRmlsdGVyIHRoZSBkaXNwbGF5ZWQgY2hhcmFjdGVycy5cbiAgICBoYW5kbGVTZWFyY2hDaGFuZ2UoIGUgKSB7XG4gICAgICAgIGNvbnN0IHNlYXJjaCA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICBjb25zdCB7ZnVsbENoYXJMaXN0LGNoYXJMaXN0fSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIGlmICgnJyA9PT0gc2VhcmNoKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtjaGFyTGlzdDogZnVsbENoYXJMaXN0fSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZENoYXJhY3RlcnMgPSB0aGlzLnJlc3VsdHNDYWNoZVtzZWFyY2hdID8gdGhpcy5yZXN1bHRzQ2FjaGVbc2VhcmNoXSA6IHRoaXMucGVyZm9ybVNlYXJjaChzZWFyY2gpO1xuICAgICAgICAgICAgdGhpcy5yZXN1bHRzQ2FjaGVbc2VhcmNoXSA9IGZpbHRlcmVkQ2hhcmFjdGVycztcbiAgICAgICAgICAgIGNvbnN0IHtjaGFyTGlzdH0gPSB0aGlzLmNoYXJMaXN0RnJvbUNoYXJhY3RlcnMoZmlsdGVyZWRDaGFyYWN0ZXJzLCAwKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2NoYXJMaXN0fSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c2VhcmNofSk7XG4gICAgfVxuXG4gICAgY2hhckxpc3RGcm9tQ2hhcmFjdGVycyhjaGFyYWN0ZXJzLCBhY3RpdmUpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgY2F0ZWdvcnlMaXN0ID0gW107XG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHNlbGYuYWN0aXZlVGFiID0gcGFyc2VJbnQoYWN0aXZlLDEwKTtcbiAgICAgICAgY29uc29sZS5sb2coICdhY3RpdmUgaW4gY2hhcmxpc3Rmcm9tY2hhcmFjdGVycycsIGFjdGl2ZSlcblxuICAgICAgICAvLyBMb29wIHRocm91Z2ggZWFjaCBjYXRlZ29yeVxuICAgICAgICB2YXIgY2hhckxpc3QgPSBPYmplY3Qua2V5cyhjaGFyYWN0ZXJzKS5tYXAoZnVuY3Rpb24oY2F0ZWdvcnkpIHtcbiAgICAgICAgICAgIGkrKztcblxuICAgICAgICAgICAgaWYgKCBzZWxmLmFjdGl2ZVRhYiA9PT0gaSApIHtcbiAgICAgICAgICAgICAgICAvLyBJbiB0aGUgYWN0aXZlIGNhdGVnb3J5LCBsb29wIHRocm91Z2ggdGhlIGNoYXJhY3RlcnMgYW5kIGNyZWF0ZSB0aGUgbGlzdFxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50SXRlbXMgPSBPYmplY3Qua2V5cyhjaGFyYWN0ZXJzW2NhdGVnb3J5XSkubWFwKGZ1bmN0aW9uKHAsYyl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoPGxpIGtleT17J3RvcGxpJyArIHB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtaGV4PXtjaGFyYWN0ZXJzW2NhdGVnb3J5XVtwXS5oZXh9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1lbnRpdHk9e2NoYXJhY3RlcnNbY2F0ZWdvcnldW3BdLmVudGl0eX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLWNoYXI9e2NoYXJhY3RlcnNbY2F0ZWdvcnldW3BdLmNoYXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS10aXRsZT17Y2hhcmFjdGVyc1tjYXRlZ29yeV1bcF0ubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsgKChlKSA9PiBzZWxmLmNoYXJDbGlja0hhbmRsZXIoZSxjaGFyYWN0ZXJzW2NhdGVnb3J5XVtwXSkpIH1cbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Y2hhcmFjdGVyc1tjYXRlZ29yeV1bcF0uY2hhcn1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRlZ29yeUxpc3QucHVzaCgoPGxpIGtleT17J2NsbGknICsgY2F0ZWdvcnkgKyBpfSBjbGFzc05hbWU9e1wiY2hhck1hcC0tY2F0ZWdvcnktbWVudS1pdGVtXCIgKyAoIHNlbGYuYWN0aXZlVGFiID09PSBpID8gJyBhY3RpdmUnIDogJycgKSB9PlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgZGF0YS1jYXRlZ29yeS1pbmRleD17aX1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17IHNlbGYuY2xpY2tDYXRlZ29yeUhhbmRsZXIgfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge2NhdGVnb3J5fVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9saT4pKTtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8bGkga2V5PXsnaW5uZXJsaScgKyBjYXRlZ29yeSArIGl9XG4gICAgICAgICAgICAgICAgICAgIGRhdGEtY2F0ZWdvcnktbmFtZT17Y2F0ZWdvcnl9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8dWxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17XCJjaGFyTWFwLS1jYXRlZ29yeSBcIiArICggc2VsZi5hY3RpdmVUYWIgPT09IGkgPyAnIGFjdGl2ZScgOiAnJyApfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtjdXJyZW50SXRlbXN9XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7Y2hhckxpc3QsY2F0ZWdvcnlMaXN0fTtcbiAgICB9XG5cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3Qge2NhdGVnb3J5TGlzdCxjaGFyTGlzdCxzZWFyY2h9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhck1hcC0tY29udGFpbmVyXCIgPlxuICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJjaGFyTWFwLS1jYXRlZ29yeS1tZW51XCIgYXJpYS1sYWJlbD1cIkNhdGVnb3JpZXNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImZpbHRlclwiPkZpbHRlcjogPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lPVwiZmlsdGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJGaWx0ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NlYXJjaH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVNlYXJjaENoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9Db21wbGV0ZT17ZmFsc2V9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICB7ICcnID09PSBzZWFyY2ggJiZcbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImNoYXJNYXAtLWNhdGVnb3J5LW1lbnVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsgY2F0ZWdvcnlMaXN0IH1cbiAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImNoYXJNYXAtLWNhdGVnb3JpZXNcIiBhcmlhLWxhYmVsPVwiQ2hhcmFjdGVyIExpc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgeyBjaGFyTGlzdCB9XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJNYXA7XG4iXX0=