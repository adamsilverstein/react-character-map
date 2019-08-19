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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnQvQ2hhcmFjdGVyTWFwLmpzIl0sIm5hbWVzIjpbIkNoYXJhY3Rlck1hcCIsInByb3BzIiwic3RhdGUiLCJhY3RpdmUiLCJzZWFyY2giLCJjYXRlZ29yeUxpc3QiLCJjaGFyTGlzdCIsImZ1bGxDaGFyTGlzdCIsInVwZGF0ZSIsInJlc3VsdHNDYWNoZSIsImhhbmRsZVNlYXJjaENoYW5nZSIsImJpbmQiLCJjbGlja0NhdGVnb3J5SGFuZGxlciIsInNldHVwQ2hhcmFjdGVycyIsImUiLCJjYXQiLCJ0YXJnZXQiLCJnZXRBdHRyaWJ1dGUiLCJ0YWIiLCJjaGFyYWN0ZXJEYXRhIiwiY2hhcmFjdGVycyIsIkNoYXJzIiwiY2hhckxpc3RGcm9tQ2hhcmFjdGVycyIsInNldFN0YXRlIiwiY2hhciIsInByZXZlbnREZWZhdWx0Iiwib25TZWxlY3QiLCJmaWx0ZXJlZENoYXJhY3RlcnMiLCJzb3J0ZWRSZXN1bHRzIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJncm91cCIsImNoYXJhY3RlciIsIm5hbWUiLCJsZW5ndGgiLCJ0b0xvd2VyQ2FzZSIsImluZGV4T2YiLCJwdXNoIiwiaW5kZXgiLCJzb3J0UG9zaXRpb24iLCJyZXN1bHRzIiwicmVzdWx0IiwidmFsdWUiLCJwZXJmb3JtU2VhcmNoIiwic2VsZiIsImkiLCJhY3RpdmVUYWIiLCJwYXJzZUludCIsIm1hcCIsImNhdGVnb3J5IiwiY3VycmVudEl0ZW1zIiwicCIsImMiLCJoZXgiLCJlbnRpdHkiLCJjaGFyQ2xpY2tIYW5kbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0FBRUE7Ozs7OztJQU1NQSxZOzs7QUFDRiwwQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLGdJQUNUQSxLQURTOztBQUVmLGNBQUtDLEtBQUwsR0FBYTtBQUNUQyxvQkFBUSxDQURDO0FBRVRDLG9CQUFRLEVBRkM7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LGFBREo7QUF1Qkg7Ozs7RUEzTHNCbUQsZ0JBQU1DLFM7O2tCQThMbEIxRCxZIiwiZmlsZSI6IkNoYXJhY3Rlck1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ2hhcnMgZnJvbSAnLi9jaGFycy5qc29uJztcbmltcG9ydCAnLi9zdHlsZS5jc3MnO1xuXG4vKipcbiAqIDxDaGFyYWN0ZXJNYXAgLz4gRWxlbWVudFxuICpcbiAqIEBleGFtcGxlIDxDaGFyYWN0ZXJNYXAgb25TZWxlY3Q9e2Z1bmN0aW9uKGNoYXIsZWwpeyBjb25zb2xlLmxvZyhjaGFyLCBlbCk7IH19IC8+XG4gKiBAZXh0ZW5kcyBSZWFjdFxuICovXG5jbGFzcyBDaGFyYWN0ZXJNYXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGFjdGl2ZTogMCxcbiAgICAgICAgICAgIHNlYXJjaDogJycsXG4gICAgICAgICAgICBjYXRlZ29yeUxpc3Q6ICcnLFxuICAgICAgICAgICAgY2hhckxpc3Q6ICcnLFxuICAgICAgICAgICAgZnVsbENoYXJMaXN0OiAnJyxcbiAgICAgICAgICAgIHVwZGF0ZTogMSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5yZXN1bHRzQ2FjaGU9W107XG4gICAgICAgIHRoaXMuaGFuZGxlU2VhcmNoQ2hhbmdlID0gdGhpcy5oYW5kbGVTZWFyY2hDaGFuZ2UuYmluZCggdGhpcyApO1xuICAgICAgICB0aGlzLmNsaWNrQ2F0ZWdvcnlIYW5kbGVyID0gdGhpcy5jbGlja0NhdGVnb3J5SGFuZGxlci5iaW5kKCB0aGlzICk7XG4gICAgICAgIHRoaXMuc2V0dXBDaGFyYWN0ZXJzID0gdGhpcy5zZXR1cENoYXJhY3RlcnMuYmluZCggdGhpcyApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBjbGlja3MgdG8gdGhlIGNhdGVnb3J5IHRhYnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIFRoZSBSZWFjdCBzeW50aGV0aWMgZXZlbnQuXG4gICAgICovXG4gICAgY2xpY2tDYXRlZ29yeUhhbmRsZXIoZSkge1xuICAgICAgICB2YXIgY2F0ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWNhdGVnb3J5LWluZGV4Jyk7XG4gICAgICAgIHRoaXMuc2V0dXBDaGFyYWN0ZXJzKCBjYXQgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHRyYWN0IGNoYXJhY3RlciBkYXRhIGF0IGEgdGFiLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRhYiBUaGUgdGFiIHRvIGRpc3BsYXkuXG4gICAgICovXG4gICAgc2V0dXBDaGFyYWN0ZXJzKCB0YWIgKSB7XG4gICAgICAgIHZhciB7IGNoYXJhY3RlckRhdGEgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHZhciBjaGFyYWN0ZXJzID0gY2hhcmFjdGVyRGF0YSB8fCBDaGFycztcbiAgICAgICAgY29uc3Qge2NoYXJMaXN0LGNhdGVnb3J5TGlzdH0gPSB0aGlzLmNoYXJMaXN0RnJvbUNoYXJhY3RlcnMoY2hhcmFjdGVycywgdGFiKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7Y2hhckxpc3QsY2F0ZWdvcnlMaXN0LGZ1bGxDaGFyTGlzdDogY2hhckxpc3R9KTtcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgdGhpcy5zZXR1cENoYXJhY3RlcnMoIDAgKTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgY2xpY2tzIHRvIHRoZSBjaGFyYWN0ZXJzLCBydW5uaW5nIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgIGNoYXJDbGlja0hhbmRsZXIoZSwgY2hhcil7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25TZWxlY3QoY2hhciwgZS50YXJnZXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm0gdGhlIGNoYXJhY3RlciBzZWFyY2guXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VhcmNoIFRoZSBzZWFyY2ggc3RyaW5nLlxuICAgICAqL1xuICAgIHBlcmZvcm1TZWFyY2goc2VhcmNoKSB7XG4gICAgICAgIHZhciB7Y2hhcmFjdGVyRGF0YX0gPSB0aGlzLnByb3BzO1xuICAgICAgICB2YXIgY2hhcmFjdGVycyA9IGNoYXJhY3RlckRhdGEgfHwgQ2hhcnM7XG4gICAgICAgIHZhciBmaWx0ZXJlZENoYXJhY3RlcnMgPSB7J1Jlc3VsdHMnOiBbXX07XG4gICAgICAgIHZhciBzb3J0ZWRSZXN1bHRzID0gW107XG4gICAgICAgIE9iamVjdC5rZXlzKGNoYXJhY3RlcnMpLmZvckVhY2goZ3JvdXAgPT4ge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMoY2hhcmFjdGVyc1tncm91cF0pLmZvckVhY2goY2hhcmFjdGVyID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWNoYXJhY3RlcnNbZ3JvdXBdW2NoYXJhY3Rlcl0ubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIElmIHNlYXJjaCBzdHJpbmcgaXMgb25lIGNoYXJhY3RlciBsb25nLCBsb29rIGZvciBuYW1lcyB0aGF0IHN0YXJ0IHdpdGggdGhhdCBjaGFyYWN0ZXIuXG4gICAgICAgICAgICAgICAgaWYgKDE9PT1zZWFyY2gubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgwID09PSBjaGFyYWN0ZXJzW2dyb3VwXVtjaGFyYWN0ZXJdLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaC50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRDaGFyYWN0ZXJzWydSZXN1bHRzJ10ucHVzaChjaGFyYWN0ZXJzW2dyb3VwXVtjaGFyYWN0ZXJdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgc2VhcmNoIHN0cmluZyBpcyB0d28gb3IgbW9yZSBjaGFyYWN0ZXJzLCBkbyBhIGZ1bGwgc2VhcmNoIG9mIHRoZSBuYW1lLlxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBjaGFyYWN0ZXJzW2dyb3VwXVtjaGFyYWN0ZXJdLm5hbWUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaC50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKC0xICE9PSBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3RvcmUgdGhlIHJlc3VsdHMgaW4gYSBzb3J0ZWQgYXJyYXkgb2YgYnVja2V0cyBiYXNlZCBvbiBzZWFyY2ggcmVzdWx0IGluZGV4LlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWF0Y2hlcyB3aXRoIGluZGV4IG9mIDIwIG9yIG1vcmUgYXJlIHN0b3JlZCBpbiB0aGUgZmluYWwgYnVja2V0LlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNvcnRQb3NpdGlvbiA9IGluZGV4IDwgMjAgPyBpbmRleCA6IDIwO1xuICAgICAgICAgICAgICAgICAgICAgICAgc29ydGVkUmVzdWx0c1tpbmRleF0gPSBzb3J0ZWRSZXN1bHRzW2luZGV4XSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRlZFJlc3VsdHNbaW5kZXhdLnB1c2goY2hhcmFjdGVyc1tncm91cF1bY2hhcmFjdGVyXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgIH0gKTtcblxuICAgICAgICAvLyBJZiB3ZSBidWlsdCBhIHNvcnRlZCBhcnJheSwgbWFwIHRoYXQgdG8gZmlsdGVyZWRDaGFyYWN0ZXJzLCBwcmVzZXJ2aW5nIHRoZSBzZXJ0IG9yZGVyLlxuICAgICAgICBpZiAoMCAhPT0gc29ydGVkUmVzdWx0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHNvcnRlZFJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZENoYXJhY3RlcnNbJ1Jlc3VsdHMnXS5wdXNoKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgfSApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkQ2hhcmFjdGVycztcbiAgICB9XG5cbiAgICAvLyBGaWx0ZXIgdGhlIGRpc3BsYXllZCBjaGFyYWN0ZXJzLlxuICAgIGhhbmRsZVNlYXJjaENoYW5nZSggZSApIHtcbiAgICAgICAgY29uc3Qgc2VhcmNoID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgIGNvbnN0IHtmdWxsQ2hhckxpc3QsY2hhckxpc3R9ID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgaWYgKCcnID09PSBzZWFyY2gpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2NoYXJMaXN0OiBmdWxsQ2hhckxpc3R9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGZpbHRlcmVkQ2hhcmFjdGVycyA9IHRoaXMucmVzdWx0c0NhY2hlW3NlYXJjaF0gPyB0aGlzLnJlc3VsdHNDYWNoZVtzZWFyY2hdIDogdGhpcy5wZXJmb3JtU2VhcmNoKHNlYXJjaCk7XG4gICAgICAgICAgICB0aGlzLnJlc3VsdHNDYWNoZVtzZWFyY2hdID0gZmlsdGVyZWRDaGFyYWN0ZXJzO1xuICAgICAgICAgICAgY29uc3Qge2NoYXJMaXN0fSA9IHRoaXMuY2hhckxpc3RGcm9tQ2hhcmFjdGVycyhmaWx0ZXJlZENoYXJhY3RlcnMsIDApO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7Y2hhckxpc3R9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtzZWFyY2h9KTtcbiAgICB9XG5cbiAgICBjaGFyTGlzdEZyb21DaGFyYWN0ZXJzKGNoYXJhY3RlcnMsIGFjdGl2ZSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBjYXRlZ29yeUxpc3QgPSBbXTtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgc2VsZi5hY3RpdmVUYWIgPSBwYXJzZUludChhY3RpdmUsMTApO1xuXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCBlYWNoIGNhdGVnb3J5XG4gICAgICAgIHZhciBjaGFyTGlzdCA9IE9iamVjdC5rZXlzKGNoYXJhY3RlcnMpLm1hcChmdW5jdGlvbihjYXRlZ29yeSkge1xuICAgICAgICAgICAgaSsrO1xuXG4gICAgICAgICAgICBpZiAoIHNlbGYuYWN0aXZlVGFiID09PSBpICkge1xuICAgICAgICAgICAgICAgIC8vIEluIHRoZSBhY3RpdmUgY2F0ZWdvcnksIGxvb3AgdGhyb3VnaCB0aGUgY2hhcmFjdGVycyBhbmQgY3JlYXRlIHRoZSBsaXN0XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRJdGVtcyA9IE9iamVjdC5rZXlzKGNoYXJhY3RlcnNbY2F0ZWdvcnldKS5tYXAoZnVuY3Rpb24ocCxjKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICg8bGkga2V5PXsndG9wbGknICsgcH0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1oZXg9e2NoYXJhY3RlcnNbY2F0ZWdvcnldW3BdLmhleH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLWVudGl0eT17Y2hhcmFjdGVyc1tjYXRlZ29yeV1bcF0uZW50aXR5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtY2hhcj17Y2hhcmFjdGVyc1tjYXRlZ29yeV1bcF0uY2hhcn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLXRpdGxlPXtjaGFyYWN0ZXJzW2NhdGVnb3J5XVtwXS5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyAoKGUpID0+IHNlbGYuY2hhckNsaWNrSGFuZGxlcihlLGNoYXJhY3RlcnNbY2F0ZWdvcnldW3BdKSkgfVxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjaGFyYWN0ZXJzW2NhdGVnb3J5XVtwXS5jaGFyfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGVnb3J5TGlzdC5wdXNoKCg8bGkga2V5PXsnY2xsaScgKyBjYXRlZ29yeSArIGl9IGNsYXNzTmFtZT17XCJjaGFyTWFwLS1jYXRlZ29yeS1tZW51LWl0ZW1cIiArICggc2VsZi5hY3RpdmVUYWIgPT09IGkgPyAnIGFjdGl2ZScgOiAnJyApIH0+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBkYXRhLWNhdGVnb3J5LWluZGV4PXtpfVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsgc2VsZi5jbGlja0NhdGVnb3J5SGFuZGxlciB9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7Y2F0ZWdvcnl9XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2xpPikpO1xuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxsaSBrZXk9eydpbm5lcmxpJyArIGNhdGVnb3J5ICsgaX1cbiAgICAgICAgICAgICAgICAgICAgZGF0YS1jYXRlZ29yeS1uYW1lPXtjYXRlZ29yeX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDx1bFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtcImNoYXJNYXAtLWNhdGVnb3J5IFwiICsgKCBzZWxmLmFjdGl2ZVRhYiA9PT0gaSA/ICcgYWN0aXZlJyA6ICcnICl9XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge2N1cnJlbnRJdGVtc31cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHtjaGFyTGlzdCxjYXRlZ29yeUxpc3R9O1xuICAgIH1cblxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7Y2F0ZWdvcnlMaXN0LGNoYXJMaXN0LHNlYXJjaH0gPSB0aGlzLnN0YXRlO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGFyTWFwLS1jb250YWluZXJcIiA+XG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImNoYXJNYXAtLWNhdGVnb3J5LW1lbnVcIiBhcmlhLWxhYmVsPVwiQ2F0ZWdvcmllc1wiPlxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZmlsdGVyXCI+RmlsdGVyOiA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9XCJmaWx0ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIkZpbHRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17c2VhcmNofVxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlU2VhcmNoQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlPXtmYWxzZX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIHsgJycgPT09IHNlYXJjaCAmJlxuICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiY2hhck1hcC0tY2F0ZWdvcnktbWVudVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgeyBjYXRlZ29yeUxpc3QgfVxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiY2hhck1hcC0tY2F0ZWdvcmllc1wiIGFyaWEtbGFiZWw9XCJDaGFyYWN0ZXIgTGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICB7IGNoYXJMaXN0IH1cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENoYXJhY3Rlck1hcDtcbiJdfQ==