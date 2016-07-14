var EDRSpellChecker = (function () {

    var dictionary = null;

    var spellCheckURL = "http://refactorbridgeqa.parcelplatform.com/js/spellcheck/JavaScriptSpellCheck/core/index2.php";
    var spellCheckDictionary = "http://refactorbridgeqa.parcelplatform.com/ajax/spellcheck/dictionary.php";
    //"/js/spellcheck/JavaScriptSpellCheck/core/index2.php";

    // class variables
    var ignoredWords = []; // array of ignored words
    var ignoredWordsInd = []; // keeps the key of ignored words for easy lookup

    var replacedWords = []; // array of replaced words
    var replacedWordsInd = []; // keeps the key of replaced words

    var validWords = []; // array of valid words

    var userDict = []; // user dictionary

    var sectionPartObj = {};

    // variables for string spellcheck
    var spDataStr = {
        curNonSpaceInd: -1,
        nextSpaceInd: -1,
        content: null,
        curWord: null,
        isFirstCharUpperCased: false,
        domCtrl: null,
        selectTextFn: null,
        words: [],
        currentWord: null,
        currentWordID: -1
    };

    // variables for DOM spellcheck
    var spDataDOM = {
        allTextNodes: null,
        curNodeInd: -1,
        replaceTextFn: null,
        getTextFn: null,
        domCtrl: null,
        domContent: ''
    };

    var replaceCounter = 0;

    var numOfSkippedWords = 0;

    var currentWordIndex = -1;
    var textWords = [];
    var textWordsIndexArray = [];
    var currentHighlightedIndex = -1;


    // highlight style
    var highlightOpenTag = '<span class="edr-sp-select" id="edr-sp-select" style="background-color: yellow !important;">';
    var highlightCloseTag = '</span>';

    // helper to decode HTML entities
    var htmlDecode = jQuery('<textarea />');

    // known regular expressions
    var reHTMLTag = /<.+>|<\/\w+>/;
    var reHTMLEntity = /&[A-Za-z]+?;/i;
    var rePunc = /^[ ~!@#$%^&*()+=?:;"{}\[\]|,.\\/]+$/;
    var reNumber = /^\d+$/;
    var reWordBreak = /\<p|\<br|\<li|\<\/li|^\s|\s$/i;

    // track changes
    //var reDeletedTrackChanges = /<span title="Deleted by.+?>.+?<\/span>|<span data-mce-contenteditable=".+?>.+?<\/span>|<span data-time=".+?>.+?<\/span>|<span data-username=".+?>.+?<\/span>|<span data-userid=".+?>.+?<\/span>|<span data-cid=".+?>.+?<\/span>|<span class="del cts-1 non-editable".+?>.+?<\/span>/gi;

    // var reDeletedTrackChanges = /<span title="Deleted by.+?>.+?<\/span>|<span data-mce-contenteditable=".+?>.+?<\/span>|<span data-time=".+?>.+?<\/span>|<span data-username=".+?>.+?<\/span>|<span data-userid=".+?>.+?<\/span>|<span data-cid=".+?>.+?<\/span>|<span class="del cts-1 non-editable".+?>.+?<\/span>/gi;

    //var reDeletedTrackChanges = /<ins class="ice-ins ice-cts" data-cid=".+?" data-userid=".+?" data-username=".+?" data-changedata=".+?" data-time=".+?" data-last-change-time=".+?">.+?<\/ins>/gi;


    // var reDeletedTrackChanges = /<ins class=".+?" data-cid=".+?" data-userid=".+?" data-username=".+?" data-changedata=".+?" data-time=".+?" data-last-change-time=".+?">.+?<\/ins>/gi;

    //var reDeletedTrackChanges = /<ins .+?>.+?<\/ins>/gi
    var reDeletedTrackChanges = /''/gi
        //var reTrackChangesKey = /--TRACKCHANGES\d+--/gi;
    var reTrackChangesKey = /\[TRACKCHANGES\d+]/gi;
    var trackChngCount = -1;
    var trackChanges = []; // key will be what we replace, value will be the original

    /*vF2hVZzzY8ZevF2hVZzzY8Ze
     * Constructor for EDRSpellChecker
     *
     * @customerID : Customer ID (future logging or persistent service)
     * @officeID : Office ID (future logging or persistent service)
     * @accountID : Account ID (future logging or persistent service)
     * @reportID : Report ID (future logging or persistent service)
     */
    function EDRSpellChecker(customerID, officeID, accountID, reportID) {
        logger('INFO', 'CustomerID: ' + customerID + ', OfficeID: ' + officeID + ', AccountID: ' + accountID + ', ReportID: ' + reportID);

        // push known valid words
        validWords.push('is');
        validWords.push('are');
    };

    /**
     * Updates the textwords index information due to changes to subwords
     * 
     * @param {JSON} subWord Subword to update
     * @param {JSON} prevSubWord The last subword that was updated
     * @returns {JSON} The last subword that was updated
     */
    function parseHTMLUpdateSubWordIndex(subWord, prevSubWord) {
        try {
            // validation
            if (subWord === null) return null;

            // update index
            if (prevSubWord === null) {
                subWord.startInd = 0;
                subWord.endInd = subWord.text.length - 1;
            } else {
                subWord.startInd = prevSubWord.endInd + 1;
                subWord.endInd = subWord.startInd + (subWord.text.length - 1);
            }

            return subWord;
        } catch (e) {
            throw e;
        }
    };

    /**
     * Updates the textwords text information due to changes to subwords
     * 
     * @param {JSON} textWord Textword to update
     * @param {JSON} prevSubWord The last subword that was updated
     * @returns {JSON} The last subword that was updated
     */
    function parseHTMLUpdateTextWord(textWord, prevSubWord) {
        try {
            // validation
            if (textWord === null) return null;

            // update text, fulltext

            textWord.text = '';
            textWord.spText = '';
            textWord.fullText = '';

            // find out if textword has WORD
            var hasWord = (textWord.getSubWords('WORD').length > 0);

            jQuery.each(textWord.subWords, function (index, subWord) {
                textWord.fullText += subWord.text;

                // update .text
                switch (subWord.type) {
                    case 'WORD':
                    case 'NUMBER':
                        textWord.text += subWord.text;
                        break;

                    case 'HTMLENTITY':
                        textWord.text += subWord.htmlDecodedText;
                        break;
                    case 'HTMLTAG':
                        textWord.text += subWord.text;
                        break;
                    case 'PUNCTUATION':
                        // only allow punctuation if there is no WORD in this text word
                        if (hasWord === false) textWord.text += subWord.text;

                    default:
                        break;
                };

                // update index
                prevSubWord = parseHTMLUpdateSubWordIndex(subWord, prevSubWord);
            });

            // udpate index
            textWord.startInd = textWord.subWords[0].startInd;
            textWord.endInd = textWord.subWords[textWord.subWords.length - 1].endInd;

            // udate spellcheck text
            textWord.spText = jQuery.trim(textWord.text.toLowerCase());

            return prevSubWord;
        } catch (e) {
            throw e;
        }
    };

    /**
     * Updates the textwords text information due to changes to subwords
     * 
     * @param {JSON} spData Data { content: html, curTypoInd: -1, textWords: newTextWords }
     * @param {Array} updatedInds Array of integer pointing to indexes for textwords that have changed
     * @returns {JSON} Data structure { content: html, curTypoInd: -1, textWords: newTextWords }
     */
    function parseHTMLUpdateTextWords(spData, updatedInds) {
        try {
            // validation

            if (spData === null) return null;
            if (spData.textWords === null) return null;

            var tws = spData.textWords;
            if (tws.length === 0) return null;

            var prevContent = spData.content;

            var lastSW = null;

            // normalize the indexes
            updatedInds = updatedInds || [];

            var newContent = '';
            var lastEndInd = -1;
            var lastTWInd = -1;

            jQuery.each(tws, function (index, tw) {
                // only process if updatedInds is not passed in or
                // if the index exists in the updatedInds
                if ((updatedInds.length === 0) || (updatedInds.indexOf(index) !== -1)) {
                    // assumption - global index has not been modified - so it correspond correctly to the
                    // prevContent
                    if (lastEndInd === -1) {
                        newContent = prevContent.substr(0, tw.subWords[0].startInd);
                    } else if ((lastTWInd + 1) < index) {
                        newContent += prevContent.substr(lastEndInd + 1, tw.subWords[0].startInd + 1);
                    }

                    // this becomes our last end-index
                    lastEndInd = tw.subWords[tw.subWords.length - 1].endInd;
                    lastTWInd = index;

                    // rebuild word.text
                    lastSW = parseHTMLUpdateTextWord(tw, lastSW);

                    newContent += tw.fullText;
                } else {
                    // update just the global indexes
                    jQuery.each(tw.subWords, function (index, subWord) {
                        lastSW = parseHTMLUpdateSubWordIndex(subWord, lastSW);
                    });
                }
            });

            // see if we have left over from prevContent
            if (lastEndInd < prevContent.length) {
                // newContent += prevContent.substr(lastEndInd + 1);
            }

            spData.content = newContent;

            return spData;
        } catch (e) {
            throw e;
        }
    };

    /**
     * Creates new textword
     * 
     * @param {JSON} subWord The first subword to add to the textword
     * @returns {JSON} New textword object
     */
    function parseHTMLCreateTextWord(subWord) {
        try {
            var tw = {
                text: '', // combination of only subWords with type=WORD preserved case
                spText: '', // text but lowercased (intended to be sent up to spellcheck engine)
                fullText: '', // combination of all subwords AS-IS including HTML tags and undecoded HTML entities - casing is preserved as well
                startInd: -1, // start index of fullText in the whole content
                endInd: -1, // end index of fullText in the whole content
                spIsValidWord: true, // status from spellcheck engine of this word is valid or not
                spResult: null, // result from spellcheck engine
                subWords: [], // subWords that make up this textWord
                getSubWords: function (swType) {
                    // returns all subword w/ the specified types
                    var ret = [];

                    // upper case
                    swType = swType || '';
                    swType = swType.toUpperCase();

                    try {
                        jQuery.each(this.subWords, function (index, sw) {
                            if (sw.type === swType) ret.push(sw);
                        });

                        return ret;
                    } catch (e) {
                        throw e;
                    }
                },
            };

            tw.subWords.push(subWord);

            return tw;
        } catch (e) {
            throw e;
        }
    };

    /**
     * Creates new subword
     * 
     * @param {String} token String to create subword with
     * @returns {JSON} New subword object
     */
    function parseHTMLCreateSubWord(token) {
        try {
            // detect deleted trackchanges
            var isTC = false;
            if (reTrackChangesKey.test(token) === true) {
                token = trackChanges[token];
                isTC = true;
            }

            // new subword
            var newSW = {
                text: token, // current text AS-IS - contains HTMLTAG or endcoded HTMLENTITY (i.e.: &amp;) - preserved casing
                originalText: token, // original text - set only the first time subWord is created
                htmlDecodedText: '', // same as text but with decoded HTMLENTITY (i.e.: &)
                type: '', // WORD, HTMLTAG, HTMLENTITY, NUMBER, PUNCTUATION, TRACKCHANGEDEL
                startInd: -1, // start index of text in the whole content
                endInd: -1, // end index of text in the whole content
                isEndOfWord: false // true if type=WORD and this is actually end of a word
            };

            // decode HTML entities
            newSW.htmlDecodedText = htmlDecode.html(newSW.text).text();

            // determine the type of word (this condition only works because of the REGEX used above -
            // if that is modified - this must be updated accordingly)
            if (isTC) {
                newSW.type = 'TRACKCHANGEDEL';
            } else if (reHTMLTag.test(newSW.text) === true) {
                newSW.type = 'HTMLTAG';
            } else if (reHTMLEntity.test(newSW.text) === true) {
                newSW.type = 'HTMLENTITY';
            } else if (rePunc.test(newSW.text) === true) {
                newSW.type = 'PUNCTUATION';
            } else if (reNumber.test(newSW.text) === true) {
                newSW.type = 'NUMBER';
            } else {
                newSW.type = 'WORD';
            }

            return newSW;
        } catch (e) {
            throw e;
        }
    };

    /**
     * Parses a string into tokens
     * 
     * @param {String} html String to be parsed
     * @returns {JSON} Data structure { content: html, curTypoInd: -1, textWords: newTextWords }
     */
    function parseHTMLString(html) {
        try {

            // regular expression to extract (https://regex101.com/r/xY1bE8/4)
            // this regex will split 
            //var parseRE = /(&[A-Za-z]+?;)|(<.+?>)|(<\/\w+>)|(--TRACKCHANGES\d+--|[\w-\']+)|([ ~!@#$%^&*()+=?:;"{}\[\]|,.\\/]+?)/gmi;
            var parseRE = /(&[A-Za-z]+?;)|(<.+?>)|(<\/\w+>)|([\w-\']+)|(\[TRACKCHANGES[0-9]{1,2}\])|([ ~!@#$%^&*()+=?:;"{}\[\]|,.\\/]+?)/gmi


            // replace all DELETED track changes with a known token
            var trackChngCount = -1;
            var htmlModified = html.replace(reDeletedTrackChanges, function (matchedText, startInd, content) {
                //var key = '--TRACKCHANGES' + (++trackChngCount) + '--';
                var key = '[TRACKCHANGES' + (++trackChngCount) + ']';
                trackChanges[key] = matchedText;

                return key;
            });

            // extracts
            var tokens = htmlModified.match(parseRE);

            // create { text: '', isAWord: false, startInd: -1, endInd: -1, subWords: [], originalText: '', highlighted: false, spIsValidWord: true, spResult: null };
            var newTextWords = [];
            var tw = null;
            var sw = null;

            var curToken = '';
            var hasWord = false;

            var isWordBreak = false;
            var textToTest = '';

            var lastSW = null;

            for (var i = 0; i < tokens.length; i++) {
                // get token
                curToken = tokens[i];

                // create subword
                sw = parseHTMLCreateSubWord(curToken);

                // if we are already working w/ textWord we need to make sure if
                // we have collected non-WORD only and this current one
                // is a WORD - we will need to end the current textWord
                if ((tw !== null) && (hasWord === false) && (sw.type === 'WORD')) {
                    // update tw information
                    lastSW = parseHTMLUpdateTextWord(tw, lastSW);

                    tw = null;
                    hasWord = false;
                }

                if (tw === null) {
                    // create new text word
                    tw = parseHTMLCreateTextWord(sw);
                    newTextWords.push(tw);

                    // reset hasWord
                    hasWord = (sw.type === 'WORD');
                } else {
                    // add subword
                    tw.subWords.push(sw);
                }

                // if so far we have not found a WORD - check if current is a WORD
                if (hasWord === false) hasWord = (sw.type === 'WORD');

                // if this is a word, we will need to look ahead to 
                // make sure we find all of the chars
                if (sw.type === 'WORD') {
                    for (var j = (i + 1); j < tokens.length; j++) {
                        // we are taking a hit by creating a dummy sw = but this makes it easier
                        // to parse
                        sw = parseHTMLCreateSubWord(tokens[j]);

                        switch (sw.type) {
                            case 'HTMLENTITY':
                                textToTest = sw.htmlDecodedText;
                                break;

                            default:
                                textToTest = sw.text;
                                break;
                        }

                        // check if this token indicates a word break
                        isWordBreak = reWordBreak.test(textToTest);
                        if (isWordBreak === false) isWordBreak = rePunc.test(textToTest);

                        if (isWordBreak === false) isWordBreak = reHTMLTag.test(textToTest);


                        if (isWordBreak === false) //|| sw.type === 'TRACKCHANGEDEL')
                        {
                            // add this current token as part of last text word
                            tw.subWords.push(sw);
                        } else {
                            // update tw if exist
                            if (tw !== null) lastSW = parseHTMLUpdateTextWord(tw, lastSW);

                            // flag it to create new tw because current token is a word boundary
                            tw = null;
                            i = j - 1; // move i to previous j because we've added tokens between i and j-1 into current textWords
                            break;
                        }
                    }
                }
            }

            // update tw if exist
            if (tw !== null) lastSW = parseHTMLUpdateTextWord(tw, lastSW);

            // update textwords
            var ret = parseHTMLUpdateTextWords({
                content: html,
                curTypoInd: -1,
                textWords: newTextWords
            }, null);

            // clear known temp storage
            delete trackChanges;

            return ret;
        } catch (e) {
            // clear known temp storage
            delete trackChanges;

            throw e;
        }
    };

    /*
     * Starts new spellcheck session for a non-HTML STRING
     *
     * @clearIgnored : Clear the previously ignored words collection
     * @clearReplaced : Clear the previously replaced words collection
     * @contentStr : String to spellcheck (does not support HTML or XML tags)
     * @domCtrl : DOM element which contains the content
     */
    EDRSpellChecker.prototype.spellCheckString = function (clearIgnored, clearReplaced, contentStr, domCtrl) {
        try {
            logger('INFO', 'spellCheckString(): ClearIgnored: ' + clearIgnored + ', ClearReplaced: ' + clearReplaced + ', Content: ' + contentStr);

            // clear previous content
            if (clearIgnored === true) {
                ignoredWords = [];
                ignoredWordsInd = []
            };
            if (clearReplaced === true) {
                replacedWords = [];
                replacedWordsInd = []
            };

            // set original content
            spDataStr.content = contentStr || '';
            spDataStr.domCtrl = domCtrl;
            spDataStr.selectTextFn = selectTextInInputDOM;

            // clear DOM data
            spDataDOM.domContent = null;
            spDataDOM.allTextNodes = null;
            spDataDOM.curNodeInd = -1;
            spDataDOM.domCtrl = null;
            spDataDOM.getTextFn = null;
            spDataDOM.replaceTextFn = null;

            // delegate
            this.nextWord = strNextWord;
            this.advanceWord = strAdvanceWord;
            this.ignoreWord = strIgnoreWord;
            this.replaceWord = strReplaceWord;
            this.replaceAll = strReplaceAll;
            this.selectText = selectTextInInputDOM;
            this.updateIgnoreWordsUI = updateIgnoreWordsUI;
            this.reset = reset;

            // Dec-4: code to fix spell check speed issues, begins here
            if (jQuery.trim(contentStr) !== '') {
                jsSCCheckForSpelling(contentStr, jsSCOnError, jsSCOnSuccess, jsSCOnComplete);
            }
            // Dec-4: code to fix spell check speed issues, ends here

            // initialize spellcheck
            if (spDataStr.content.length >= 0) {
                // find the location of the first non-whitespace char    	  
                spDataStr.curNonSpaceInd = nextIndexOf(0, false); //spDataStr.content.search(/\S|$/);
                if (spDataStr.curNonSpaceInd === spDataStr.content.length) spDataStr.curNonSpaceInd = -1; // reset since this is at the end of string
            }
        } catch (e) {
            logger('ERROR', 'spellCheckString(): ' + e.message);
            throw e;
        }
    };


    function reset() {
        jQuery("#ignoreWordsList").val('');
        jQuery("#ignoreAllWordsList").val('');
    }

    /*
     * Helper function to show the list of ignored and ignoredAll words on the UI
     */
    function updateIgnoreWordsUI() {
        // remove this return if you'd like to see the ignored words list on the UI
        return;
        var ignoreWordsList = [];
        var ignoreAllWordsList = [];

        for (var i = 0; i < ignoredWords.length; i++) {
            if (ignoredWords[i] === true) {
                ignoreAllWordsList.push(ignoredWordsInd[i]);
            } else {
                ignoreWordsList.push(ignoredWordsInd[i]);
            }
        }

        ignoreWordsList.sort();
        ignoreAllWordsList.sort();
        jQuery("#ignoreWordsList").val(ignoreWordsList.join('\n'));
        jQuery("#ignoreAllWordsList").val(ignoreAllWordsList.join('\n'));
    }

    /*
     * Starts new spellcheck session for a content in a DOM node
     *
     * @clearIgnored : Clear the previously ignored words collection
     * @clearReplaced : Clear the previously replaced words collection
     * @startNode : Node to start to spellcheck
     */
    EDRSpellChecker.prototype.spellCheckDOM = function (clearIgnored, clearReplaced, startNode, sectionPart) {
        try {
            // clear previous content
            if (clearIgnored === true) {
                ignoredWords = [];
                ignoredWordsInd = []
            };
            if (clearReplaced === true) {
                replacedWords = [];
                replacedWordsInd = []
            };


            sectionPartObj = sectionPart;

            // define the text function so that we don't keep checking between IE (.innerText) and others (.textContent)
            spDataDOM.replaceTextFn = function (node, newValue) {
                if (typeof node.innerText === 'undefined')
                    spDataDOM.replaceTextFn = function (node, newValue) {
                        node.textContent = newValue;
                    };
                else
                    spDataDOM.replaceTextFn = function (node, newValue) {
                        node.innerText = newValue;
                    };

                // call it after we overwrote the fn
                spDataDOM.replaceTextFn(node, newValue);
            };

            spDataDOM.getTextFn = function (node) {
                if (typeof node.innerText === 'undefined')
                    spDataDOM.getTextFn = function (node) {
                        return node.textContent;
                    };
                else
                    spDataDOM.getTextFn = function (node) {
                        return node.innerText;
                    };

                // call it after we overwrote the fn
                return spDataDOM.getTextFn(node);
            };

            spDataDOM.curNodeInd = -1;
            spDataDOM.domCtrl = startNode;

            // parse the HTML from the node into text words
            spDataDOM.domContent = parseHTMLString(startNode);
            /* if (sectionPartObj.type == "INLINECKEDITOR") {
                 spDataDOM.domContent = parseHTMLString(startNode);
             } else {
                 spDataDOM.domContent = parseHTMLString($(startNode.$).html());
             }*/

            // spellcheck the words
            var spellCheckText = buildTextForSpellCheck(spDataDOM.domContent.textWords);

            jsSCCheckForSpelling(spellCheckText, jsSCOnError, function (data, statusText, jqXhr) {
                jsSCOnSuccessDOM(data, statusText, jqXhr, spDataDOM.domContent.textWords);
            }, jsSCOnComplete);

            // move to the first typo
            domAdvanceWord();

            // delegate
            this.nextWord = domNextWord;
            this.advanceWord = domAdvanceWord;
            this.ignoreWord = domIgnoreWord;
            this.replaceWord = domReplaceWord;
            this.replaceAll = domReplaceAll;
            this.selectText = selectTextDOM;
            this.updateIgnoreWordsUI = updateIgnoreWordsUI;
            this.reset = reset;
        } catch (e) {
            logger('ERROR', 'spellCheckDOM(): ' + e.message);
            throw e;
        }
    };

    /*
     * Get the next word to spellcheck
     *
     * @return: null if no more word to spellcheck, otherwise JSON { original: '', suggested: ['', ''], node: null }
     */
    EDRSpellChecker.prototype.nextWord = function () {
        //  alert('nextWord Spellcheck has not been initialized');
        return null;
    };

    /*
     * Concrete function for STRING nextWord()
     */
    function strNextWord() {
        try {
            //$Spelling.IgnoreAllCaps = true;

            // more words?
            if (spDataStr.curNonSpaceInd === -1) return null;

            // get the word from the current index to the next space
            var nextSpaceInd = nextIndexOf(spDataStr.curNonSpaceInd, true);

            logger('MATCH', 'strNextWord(): CurrentNonSpaceInd: ' + spDataStr.curNonSpaceInd + ', NextSpaceInd: ' + nextSpaceInd);

            // store 
            spDataStr.nextSpaceInd = nextSpaceInd;

            // return null if there is no more data
            if (nextSpaceInd === spDataStr.curNonSpaceInd) {
                spDataStr.curNonSpaceInd = -1;
                return null;
            }

            // get the word
            spDataStr.curWord = spDataStr.content.substr(spDataStr.curNonSpaceInd, nextSpaceInd - spDataStr.curNonSpaceInd);
            spDataStr.isFirstCharUpperCased = (spDataStr.curWord[0].match(/[A-Z]/) !== null);

            logger('INFO', 'strNextWord(): CurrentNonSpaceInd: ' + spDataStr.curNonSpaceInd + ', NextSpaceInd: ' + nextSpaceInd + ', Length: ' + spDataStr.content.length + ', SubStr: \'' + spDataStr.curWord + '\'');

            // check if this word has been ignored
            var key = spDataStr.curWord.toLowerCase();
            var doSuggestWord = !_isValidWord(spDataStr.curWord);

            var isValidWord = true;

            // check spelling
            var spRetVal = [];

            if (doSuggestWord === true) {
                // spellcheck
                logger('INFO', 'strNextWord(): Spellchecking \'' + spDataStr.curWord + '\'');

                // Dec-4: code to use local dictionary instead of making a server call
                if (dictionary !== null) {
                    // find word in our dictionary
                    isValidWord = dictionary[spDataStr.curWord] ? dictionary[spDataStr.curWord].isValid : false;

                    if (!isValidWord) {
                        logger('INFO', 'strNextWord(): Retrieving suggestion for \'' + spDataStr.curWord + '\'');

                        // Dec-4: added the following line to use local dictionary
                        // TODO: iif condition should not happen but it is because our code interpret a word differently from JS engine
                        spRetVal = dictionary[spDataStr.curWord] ? dictionary[spDataStr.curWord]['suggest_words'] : null;

                        // sometimes the spellcheck engine returns suggested words inside an array - sometimes no - so we will normalize here
                        if (spRetVal !== null) {
                            if ((spRetVal instanceof Array) && (spRetVal.length === 1) && (spRetVal[0] instanceof Array)) {
                                spRetVal = spRetVal[0];
                            } else if (spRetVal instanceof String) {
                                // convert to array
                                var tmp = [];
                                tmp[0] = spRetVal;

                                spRetVal = tmp;
                            }
                        }
                    } else {
                        // push into valid words dictionary
                        logger('INFO', 'strNextWord(): Valid word \'' + spDataStr.curWord + '\'');
                        validWords.push(key);
                    }
                }
            } else {
                logger('INFO', 'strNextWord(): Skipping \'' + spDataStr.curWord + '\' since it is deemed as valid or ignored word');
            }

            // since this is a valid word - let's keep going
            if ((isValidWord === true) && (numOfSkippedWords < 10)) {
                ++numOfSkippedWords;
                strAdvanceWord();
                return strNextWord();
            } else
                numOfSkippedWords = 0;

            // return data
            return {
                originalWord: spDataStr.curWord,
                suggestedWords: spRetVal,
                node: null,
                isValidWord: isValidWord
            };
        } catch (e) {
            logger('ERROR', 'strNextWord(): ' + e.message);
            throw e;
        }
    };

    /*
     * Concrete function for DOM nextWord()
     */
    function domNextWord() {
        try {
            // get data
            var spData = spDataDOM.domContent || null;
            if (spData === null) return null;

            var tws = spData.textWords;
            if (tws === null) return null;
            if (tws.length === 0) return null;

            // advance it until we get to the next typo
            var curInd = spData.curTypoInd;
            if (curInd >= tws.length) return null;

            // return the result
            var tw = tws[curInd];
            var res = tw.spResult;

            return {
                originalWord: tw.text,
                suggestedWords: res.suggest_words,
                node: spDataDOM.domCtrl,
                isValidWord: tw.spIsValidWord
            };
        } catch (e) {
            logger('ERROR', 'domNextWord(): ' + e.message);
            throw e;
        }
    };

    /*
     * Advance to next word
     *
     * @return: True of there are more words, False no more words
     */
    EDRSpellChecker.prototype.advanceWord = function () {
        // alert('advanceWord Spellcheck has not been initialized');
        return false;
    };

    /*
     * Concrete function for STRING advanceWord()
     */
    function strAdvanceWord() {
        try {
            // more words?
            if (spDataStr.curNonSpaceInd === -1) return false;

            // look for the first non-space after the last space index
            var nextNonSpaceInd = nextIndexOf(spDataStr.nextSpaceInd, false);

            logger('INFO', 'strAdvanceWord(): NextSpaceInd: ' + spDataStr.nextSpaceInd + ', NextNonSpaceInd: ' + nextNonSpaceInd);

            // any more word?
            spDataStr.curWord = null; // reset word

            if (nextNonSpaceInd === spDataStr.nextSpaceInd) {
                // no more words - reset data
                spDataStr.curWord = null;
                spDataStr.nextSpaceInd = -1;
                spDataStr.curNonSpaceInd = -1;
            } else {
                // found next word
                spDataStr.curNonSpaceInd = nextNonSpaceInd;
            }

            // return value
            return (spDataStr.curNonSpaceInd !== -1)
        } catch (e) {
            logger('ERROR', 'strAdvanceWord(): ' + e.message);
            throw e;
        }
    };

    /*
     * Concrete function for DOM advanceWord()
     */
    function domAdvanceWord() {
        try {
            // get data
            var spData = spDataDOM.domContent || null;
            if (spData === null) return false;

            var tws = spData.textWords;
            if (tws === null) return false;
            if (tws.length === 0) return false;

            // advance it until we get to the next typo
            var curInd = spData.curTypoInd;
            if (curInd >= tws.length) return false;

            var tw = null;

            for (++curInd; curInd < tws.length; curInd++) {
                // get tw
                tw = tws[curInd];

                if (tw.spText !== '') {
                    // check if this is a valid word if flag as invalid
                    if (tw.spIsValidWord === false) {
                        tw.spIsValidWord = _isValidWord(tw.text);
                    }

                    if (tw.spIsValidWord === false) {
                        // found invalid word
                        break;
                    }
                }
            }

            // set the data
            spData.curTypoInd = curInd;

            return (curInd < tws.length);
        } catch (e) {
            throw e;
        }
    };

    /*
     * Ingores the last word returned by nextWord()
     *
     * @ignoreAll: True to ignore all instances of original word, False to ignore only the current instance
     * @return: True of there are more words, False no more words
     */
    EDRSpellChecker.prototype.ignoreWord = function (ignoreAll) {
        //alert('ignoreWord Spellcheck has not been initialized');
        return false;
    };

    /*
     * Concrete function for STRING ignoreWord()
     */
    function strIgnoreWord(ignoreAll) {
        try {
            // more words?
            if (spDataStr.curNonSpaceInd === -1) return false;

            addOrCheckIgnoreWord(spDataStr.curWord, false, ignoreAll);

            updateIgnoreWordsUI();

            // advance the pointer
            return strAdvanceWord();
        } catch (e) {
            logger('ERROR', 'strIgnoreWord(): ' + e.message);
            throw e;
        }
    };

    /*
     * Concrete function for DOM ignoreWord()
     */
    function domIgnoreWord(ignoreAll) {
        try {
            // get data
            var spData = spDataDOM.domContent || null;
            if (spData === null) return false;

            var tws = spData.textWords;
            if (tws === null) return false;
            if (tws.length === 0) return false;

            // advance it until we get to the next typo
            var curInd = spData.curTypoInd;
            if (curInd >= tws.length) return false;

            // delegate to string ignore
            addOrCheckIgnoreWord(tws[curInd].spText, false, ignoreAll);

            updateIgnoreWordsUI();

            // find next word
            return domAdvanceWord();
        } catch (e) {
            logger('ERROR', 'domIgnoreWord(): ' + e.message);
            throw e;
        }
    };

    /*
     * Add words into ignored dictionary (or just check if it is)
     *
     * @word: word to ignore
     * @checkIfExistOnly: true to only check if word is already ignored as ignoreAll, false to add if does not exist
     * @ignoreAll: True to ignore all instances of original word, False to ignore only the current instance
     * @return: { word: null, ignoreAll: null } object or null if word === null or does not exist in check mode
     */
    function addOrCheckIgnoreWord(word, checkIfExistOnly, ignoreAll) {
        try {
            // validation
            if (word === null) {
                return null;
            }

            // find word in ignored dictionary (note in the future if casing is considered - the .toLowerCase()
            // must be done conditionally)
            var key = jQuery.trim(word.toLowerCase());
            var keyInd = ignoredWordsInd.indexOf(key, 0);

            if (keyInd !== -1) {
                // found it
                logger('INFO', 'addIgnoreWord(): \'' + key + '\' is already ignored');

                if (ignoredWords[keyInd] === false && ignoreAll === true) {
                    ignoredWords[keyInd] = true;
                }
                return {
                    word: word,
                    ignoreAll: ignoredWords[keyInd]
                };
            } else if (checkIfExistOnly === true) {
                // exit since this is just a test
                return null;
            }

            // add to dictionary 
            ignoredWordsInd.push(key);
            ignoredWords.push(ignoreAll || false);

            logger('INFO', 'addIgnoreWord(): \'' + key + '\' added to ignored dictionary');

            return {
                word: word,
                ignoreAll: ignoredWords[ignoredWords.length - 1]
            };
        } catch (e) {
            logger('ERROR', 'addIgnoreWord(): ' + e.message);
            throw e;
        }
    };

    /*
     * Replaces the last word returned by nextWord()
     *
     * @replaceAll: True to relace all instances of original word, False to replace only the current instance
     * @replaceWith: New value
     * @return: Returns the updated content
     */
    EDRSpellChecker.prototype.replaceWord = function (replaceAll, replaceWith) {
        // alert('replaceWord Spellcheck has not been initialized');
        return null;
    };

    /*
     * Concrete function for STRING replaceWord()
     */
    function strReplaceWord(replaceAll, replaceWith) {

        try {
            // anything to replace?
            if ((spDataStr.curWord === null) || (spDataStr.curWord.length === 0)) return spDataStr.content;

            // add to dictionary if this is replace all
            replaceAll = replaceAll || false;
            replaceWith = replaceWith || '';

            if (replaceAll === true) {
                // replace all
                var key = spDataStr.curWord.toLowerCase();

                var keyInd = replacedWordsInd.indexOf(key);

                if (keyInd === -1) {
                    // not found -- add into dic
                    replacedWordsInd.push(key);
                    replacedWords.push(replaceWith);
                }

                // use it to replace all occurences (regex options: global, case insensitive, multiple line)
                spDataStr.content = replaceAllWordInstances(spDataStr.content, spDataStr.curWord, replaceWith);
            } else {
                // replace current
                var firstPart = spDataStr.content.substring(0, spDataStr.curNonSpaceInd);
                var secondPart = spDataStr.content.substr(spDataStr.nextSpaceInd);

                var newContent = firstPart + replaceWith + secondPart;
                spDataStr.content = newContent;
            }

            logger('INFO', 'strReplaceWord(): Original: ' + spDataStr.curWord + ', New: ' + replaceWith + ', ReplaceAll: ' + replaceAll);

            // at this moment spDataStr.nextSpaceInd may not be correct
            // reset it by looking for next whitespace/punctuation starting form spDataStr.curNonSpaceInd
            spDataStr.nextSpaceInd = nextIndexOf(spDataStr.curNonSpaceInd, true);

            // advance the pointer
            strAdvanceWord();

            return spDataStr.content;
        } catch (e) {
            logger('ERROR', 'strReplaceWord(): ' + e.message);
            throw e;
        }
    };

    /**
     * Replaces word in a textword
     * 
     * @param {JSON} textWord Textword to be updated
     * @param {String} originalWord Original value
     * @param {String} replaceWith New value
     */
    function domReplaceTextWord(textWord, originalWord, replaceWith) {
        try {
            var lastSubWordInd = -1;
            var origReplaceWithLen = replaceWith.length;
            var didReplace = false;

            // replace what we can
            jQuery.each(textWord.subWords, function (index, subWord) {
                if (subWord.type === 'WORD') {
                    lastSubWordInd = index;

                    subWord.text = replaceWith.substr(0, subWord.text.length);
                    replaceWith = subWord.text.length >= replaceWith.length ? '' : replaceWith.substr(subWord.text.length);
                    subWord.htmlDecodedText = subWord.text;

                    didReplace = true;
                }
            });

            var counter = -1;

            // if replaceWith.length < originalWord.length - we expect to remove the rest of non-html subwords
            if (lastSubWordInd < (textWord.subWords.length - 1)) {
                var htmlTags = [];
                counter = lastSubWordInd + 1;
                var noOfSubWords = textWord.subWords.length;

                for (; counter < noOfSubWords; counter++) {
                    if (textWord.subWords[counter].type !== 'WORD')
                        htmlTags.push(textWord.subWords[counter]);
                }

                textWord.subWords = textWord.subWords.slice(0, (lastSubWordInd + 1)).concat(htmlTags);
            }

            // if replaceWith.length > originalWord.length - find the last non-html and non-punc to append the rest
            // of the word to
            if (origReplaceWithLen > originalWord.length) {
                for (counter = textWord.subWords.length - 1; counter >= 0; counter--) {
                    if (textWord.subWords[counter].type === 'WORD') {
                        textWord.subWords[counter].text += replaceWith;
                        textWord.subWords[counter].htmlDecodedText += textWord.subWords[counter].text;
                        break;
                    }
                }
            }

            return didReplace;
        } catch (e) {
            throw e;
        }
    };

    /**
     * Replaces word in all textwords
     * 
     * @param {JSON} spData Spellheck data
     * @param {Boolean} replaceAll True to relace all instances of original word, False to replace only the current instance
     * @param {String} originalWord Original value
     * @param {String} replaceWith New value
     */
    function domReplaceTextWords(spData, replaceAll, originalWord, replaceWith) {
        try {
            // get data
            if (spData === null) return false;

            var tws = spData.textWords;
            if (tws === null) return false;
            if (tws.length === 0) return false;

            // current type
            var curInd = spData.curTypoInd;

            var replacedTextWordInds = [];

            if ((replaceAll !== true) && (curInd < tws.length)) {
                // replace once
                if (domReplaceTextWord(tws[curInd], originalWord, replaceWith) === true) {
                    replacedTextWordInds.push(currentWordIndex);
                }
            } else if (replaceAll === true) {
                // replace all
                var originalWordCI = originalWord.toLowerCase();

                jQuery.each(tws, function (index, tw) {
                    if (tw.spText === originalWordCI) {
                        if (domReplaceTextWord(tw, originalWord, replaceWith) === true) {
                            replacedTextWordInds.push(index);
                        }
                    }
                });
            }

            // update the text words
            spData = parseHTMLUpdateTextWords(spData, replacedWordsInd);

            return domBuildContent(spData, -1);
        } catch (e) {
            throw e;
        }
    };

    /**
     * Concrete function for STRING replaceWord()
     * 
     * @param {Boolean} replaceAll True to relace all instances of original word, False to replace only the current instance
     * @param {String} originalWord Original value
     * @param {String} replaceWith New value
     * @returns {JSON} Data structure { node: spDataDOM.domCtrl, content: html }
     */
    function domReplaceWord(replaceAll, originalWord, replaceWith) {
        try {
            // replace 
            var html = domReplaceTextWords(spDataDOM.domContent, replaceAll, originalWord, replaceWith);

            // update dom
            if (sectionPartObj.type == "CKEDITOR") {
                var splitarr = sectionPartObj.editorName.split('_');
                var editorname = splitarr[1];
                CKEDITOR.instances[sectionPartObj.editorName].setData(html);
            } else if (sectionPartObj.type == "INLINECKEDITOR") {
                var splitarr = sectionPartObj.editorName.split('_');
                var editorname = sectionPartObj.editorName;
                //CKEDITOR.instances[editorname].setData(html);
                console.log("sectionPart.sectionID set data" + sectionPartObj.sectionID)
                $("#section_" + sectionPartObj.sectionID).find("#" + sectionPartObj.editorName).html(html);

            } else {
                $(spDataDOM.domCtrl.$).html(html);
            }

            // next type
            domAdvanceWord();

            return {
                node: spDataDOM.domCtrl,
                content: html
            };
        } catch (e) {
            logger('ERROR', 'domReplaceWord(): ' + e.message);
            throw e;
        }
    };

    /**
     * Builds DOM content using text words
     * 
     * @param {JSON} spData Spellheck data
     * @param {Integer} highlightedIndex Index of text word that needs to be highlighted
     */
    function domBuildContent(spData, highlightedIndex) {
        try {
            // get data
            if (spData === null) return null;

            var tws = spData.textWords;
            if (tws === null) return spData.content;
            if (tws.length === 0) return spData.content;

            // any available?
            srcFullContent = spData.content;

            // return if not highligting
            if (highlightedIndex < 0) return srcFullContent;

            // get the highlighted textword
            var tw = tws[highlightedIndex];

            // get the begining 
            var fullText = srcFullContent.substr(0, tw.subWords[0].startInd);

            // append highlight
            jQuery.each(tw.subWords, function (index, sw) {
                if (sw.type === 'WORD')
                    fullText += highlightOpenTag + sw.text + highlightCloseTag;
                else
                    fullText += sw.text;
            });

            // append the rest
            fullText += srcFullContent.substr(tw.subWords[tw.subWords.length - 1].endInd + 1);

            return fullText;
        } catch (e) {
            throw e;
        }
    };

    /**
     * Replaces all appearances of the current word in the current content with replaceWith
     * 
     * @param {String} originalWord The original word (typo) 
     * @param {String} replaceWith The new word
     */
    EDRSpellChecker.prototype.replaceAll = function (originalWord, replaceWith) {
        //alert('replaceAll Spellcheck has not been initialized');
        return null;
    };

    /*
     * Concrete function for STRING replaceAll()
     * 
     * @param {String} originalWord The original word (typo) 
     * @param {String} replaceWith The new word
     */
    function strReplaceAll(originalWord, replaceWith) {
        try {
            // anything to replace?
            if (spDataStr.content === null) return null;

            var content = spDataStr.content;

            content = replaceAllWordInstances(content, originalWord, replaceWith);

            spDataStr.content = content;

            // retun updated content
            return content;
        } catch (e) {
            logger('ERROR', 'strReplaceAll(): ' + e.message);
            throw e;
        }
    };

    /**
     * Concrete function for STRING replaceAll() but accepts the STRING to find and replace
     * 
     * @param {String} content The original content
     * @param {String} originalWord The original word (typo) 
     * @param {String} replaceWith The new word
     */
    function strReplaceAllByContent(content, originalWord, replaceWith) {
        try {
            // anything to replace?
            if (content === null) return null;

            content = replaceAllWordInstances(content, originalWord, replaceWith);

            // retun updated content
            return content;
        } catch (e) {
            logger('ERROR', 'strReplaceAll(): ' + e.message);
            throw e;
        }
    };

    /*
     * Concrete function for DOM replaceAll()
     * 
     * @param {String} originalWord The original word (typo) 
     * @param {String} replaceWith The new word
     */
    function domReplaceAll(originalWord, replaceWith) {
        try {
            domReplaceWord(true, originalWord, replaceWith)
        } catch (e) {
            logger('ERROR', 'domReplaceAll(): ' + e.message);
            throw e;
        }
    };

    /*
     * Replaces all appearances of the current word in the current content with replaceWith
     *
     * @param {string} content The string content to apply replacement to
     * @param {string} originalWord The original word to find
     * @param {string} replaceWith The string to replace the original word with
     */
    EDRSpellChecker.prototype.replaceAllString = function (content, originalWord, replaceWith) {
        try {
            // replace all instances
            return replaceAllWordInstances(content, originalWord, replaceWith);
        } catch (e) {
            logger('ERROR', e.message);
            return content;
        }
    };

    /*
     * Replaces all appearances of the current word in the current content with replaceWith
     *
     * @param {HTMLDomElement} HTML node that we need to apply replacement to
     * @param {string} originalWord The original word to find
     * @param {string} replaceWith The string to replace the original word with
     */
    EDRSpellChecker.prototype.replaceAllDOM = function (elementType, editorName, sectionId, node, originalWord, replaceWith) {
        try {
            // get HTML

            var html = '';
            if (elementType == "CKEDITOR") {

                html = CKEDITOR.instances[editorName].getData()

            } else if (elementType == "INLINECKEDITOR") {
                html = $("#section_" + sectionId).find("#" + editorName).html();
                //CKEDITOR.instances[editorName].setData(html);
            } else {

                html = $(spDataDOM.domCtrl.$).html();
            }

            //var html = $(node.$).html(); //

            //var html = $(node).html();
            // parse string
            var spData = parseHTMLString(html);

            // get textwords
            var tws = spData.textWords;

            if (tws === null) return false;
            if (tws.length === 0) return false;

            // replace words
            html = domReplaceTextWords(spData, true, originalWord, replaceWith);

            // update node
            //  jQuery(node).html(html);

            if (elementType == "CKEDITOR") {

                CKEDITOR.instances[editorName].setData(html);

            } else if (elementType == "INLINECKEDITOR") {
                $("#section_" + sectionId).find("#" + editorName).html(html);
                //CKEDITOR.instances[editorName].setData(html);
            } else {

                $(spDataDOM.domCtrl.$).html(html);
            }

        } catch (e) {
            logger('ERROR', e.message);
            throw e;
        }
    };

    /*
     * Returns the next index of a whitespace or non-whitespace
     *
     * @startInd : Index to start searching
     * @isWhiteSpaceAndPunctuation : true to search for whitespace or punctuation, false to search for others
     * @return : the last position of startInd regardless whether item was found or not
     */
    function nextIndexOf(startInd, isWhiteSpaceAndPunctuation) {
        try {
            // whitespace 
            var regExp = isWhiteSpaceAndPunctuation ? /\s|[^\s\w]/gm : /\w/gm;

            for (; startInd < spDataStr.content.length; startInd++) {
                if (spDataStr.content[startInd].match(regExp)) {
                    switch (spDataStr.content[startInd]) {
                        case '\'':
                        case '-':
                            // look for next char
                            if (((startInd + 1) >= spDataStr.content.length) || ((spDataStr.content[startInd + 1].match(/[\w ]/) === null) && (spDataStr.content[startInd + 1] !== '.')))
                                return startInd;

                            break;

                        default:
                            // ok to return
                            return startInd;
                    }
                }
            }

            return startInd;
        } catch (e) {
            logger('ERROR', 'nextIndexOf(): ' + e.message);
            throw e;
        }
    };

    /*
     * Replaces all instances of origVal with newVal using RegExp.
     *
     * @content : Content to replace
     * @origVal : Orignal value to look for
     * @newVal : New value to replace with
     * @return : Updated content
     */
    function replaceAllWordInstances(content, origVal, newVal) {
        try {
            //alert("replaceAllWordInstances");
            // escape the original word for regex use
            var origWordRegex = origVal.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            var replaceRegExp = new RegExp(origWordRegex, 'gim');

            // use it to replace all occurences (regex options: global, case insensitive, multiple line)
            //content = content.replace(replaceRegExp, newVal);
            content = content.replace(replaceRegExp, function (val) {
                // validation
                if (val.length === 0) return '';

                // use the same case as the first letter of the original word
                if (val.match(/[A-Z]/) !== null) {
                    newVal = newVal.replace(/\b[a-z]/, function (val) {
                        // return val.toUpperCase();
                        return val;
                    });
                } else {
                    newVal = newVal.replace(/\b[A-Z]/, function (val) {
                        // return val.toLowerCase();
                        return val;
                    });
                }
                replaceCounter++;
                return newVal;
            });

            return content;
        } catch (e) {
            logger('ERROR', 'replaceAll(): ' + e.message);
        }
    };

    /*
     * Our custom call to JS Spellcheck Engine onError callback
     */
    function jsSCOnError(jqXhr, statusText, errorText) {
        logger('ERROR', 'JSSPENGINE completed: ' + statusText + '(' + errorText + ')');
    };

    /*
     * Our custom call to JS Spellcheck Engine onSuccess callback
     */
    function jsSCOnSuccess(result, statusText, jqXhr) {
        logger('ERROR', 'JSSPENGINE completed: ' + statusText);

        // convert into associative array to make search easier
        dictionary = [];

        for (var i = 0; i < result.length; i++) {
            spDataStr.words.push(result[i]);

            // flag whether word is valid or not
            result[i].isValid = result[i].status === 'F' ? false : true;
            result[i].suggest_words = result[i].suggest_words || []; // normalize so that we don't have to keep checking

            if (!result[i].isValid) {
                // add into dictionary
                dictionary[jQuery.trim(result[i].word)] = result[i];
            } else {
                // add into valid words
                var key = result[i].word.toLowerCase();

                if (validWords.indexOf(key) === -1) {
                    validWords.push(key);
                }
            }
        }
    };

    /*
     * Our custom call to JS Spellcheck Engine onSuccess callback for DOM
     */
    function jsSCOnSuccessDOM(result, statusText, jqXhr, tws) {
        if (result.length > 0) {

            var noOfWords = tws.length;

            var spWordCI = '';

            var resultLength = result.length;

            if ((resultLength > 0) && (noOfWords > 0)) {
                for (i = 0; i < resultLength; i++) {
                    // flag whether word is valid or not
                    result[i].isValid = result[i].status === 'F' ? false : true;
                    result[i].suggest_words = result[i].suggest_words || []; // normalize so that we don't have to keep checking

                    spWordCI = jQuery.trim(result[i].word).toLowerCase();

                    if ((result[i].isValid === true) && (validWords.indexOf(spWordCI) === -1)) {
                        validWords.push(spWordCI);
                    }

                    for (j = 0; j < noOfWords; j++) {
                        if (tws[j].spText === spWordCI) {
                            tws[j].spIsValidWord = result[i].isValid;
                            tws[j].spResult = result[i];
                        }
                    }
                }
            }
        }
    };

    /*
     * Our custom call to JS Spellcheck Engine onComplete callback
     */
    function jsSCOnComplete(jqXhr, statusText) {
        logger('INFO', 'JSSPENGINE completed: ' + statusText);
    };

    /*
     * Our custom call to JS Spellcheck Engine so that we can parse a bunch of text instead of just one at a time
     *
     * @spellCheckString : String to spellcheck
     */
    function jsSCCheckForSpelling(spellCheckString, onErrorFn, onSuccessFn, onCompleteFn) {
        try {
            if ((spellCheckString === undefined) || (spellCheckString === '') || isNaN(spellCheckString.trim()) === false) {
                return false;
            }

            // special case, to skip big takes that contain a bunch of "NR" values
            if (spellCheckString.trim() === 'NR') {
                return false;
            }

            // reset dictionary
            dictionary = null;

            // call our modified version of the spellcheck PHP function to get the dictionary
            // regular expression to remove punctuations from words
            jQuery.ajax({
                url: spellCheckURL,
                data: {
                    note: '',
                    command: 'APISPELLARRAY',
                    args: spellCheckString,
                    lan: "English (International)",
                    sender: "0",
                    settingsfile: 'default-settings'
                },
                type: 'POST',
                dataType: 'json',
                async: false,
                success: onSuccessFn,
                error: onErrorFn,
                complete: onCompleteFn
            });
        } catch (e) {
            throw e;
        }
    };

    /**
     * Builds one long text string to be sent to PHP for spell check
     * 
     * @param {Array} tws Array of text words as returned by parseHTMLToTextWords()
     * @returns {String} Returns a string built from concatenating the 'text' property of textWords array.
     */
    function buildTextForSpellCheck(tws) {
        var listOfWords = [];

        if (tws.length > 0) {
            jQuery.each(tws, function (index, tw) {
                if ((tw.spText !== '') && (_isValidWord(tw.text) === false)) {
                    // do not send duplicate words to the PHP spell check code
                    if (listOfWords.indexOf(tw.spText) === -1) {
                        if (tw.spText.trim() !== '' && tw.spText.length > 2 && tw.spText[0] === "'" && tw.spText[tw.spText.length - 1] === "'") {
                            listOfWords.push(tw.spText.substring(1, tw.spText.length - 1));
                        } else {
                            listOfWords.push(tw.spText);
                        }

                    }
                }
            });
        }

        if (listOfWords.length > 0) {
            return listOfWords.join(" ");
        } else {
            return '';
        }
    };

    /*
     * Our custom call to JS Spellcheck Engine so that we can parse a bunch of text instead of just one at a time
     *
     * @spellCheckString : String to spellcheck
     */
    EDRSpellChecker.prototype.checkForSpelling = jsSCCheckForSpelling;

    /*
     * Selects the text on the UI
     *
     */
    EDRSpellChecker.prototype.selectText = function () {

        // alert('selectText Spellcheck has not been initialized');
        return null;
    };

    /*
     * Selects the text currently being spellchecked
     */
    function selectTextInInputDOM(selectIt) {
        try {
            // validation
            if (spDataStr.domCtrl === null) return false;

            var domCtrl = spDataStr.domCtrl;

            if (spDataStr.curNonSpaceInd === -1) {
                jQuery(spDataStr.domCtrl).focus();
                return;
            }

            if ('selectionStart' in domCtrl) {
                domCtrl.selectionStart = spDataStr.curNonSpaceInd;
                domCtrl.selectionEnd = spDataStr.nextSpaceInd;
            } else {
                // IE < 9
                var inputRange = domCtrl.createTextRange();
                inputRange.moveStart("character", spDataStr.curNonSpaceInd);
                inputRange.collapse();
                inputRange.moveEnd("character", spDataStr.nextSpaceInd - spDataStr.curNonSpaceInd);
                inputRange.select();
            }
        } catch (e) {
            logger('ERROR', 'selectTextInInputDOM(): ' + e.message);
        }
    };

    /*
     * Selects the text currently being spellchecked (for now only support TinyMCE)
     */
    function selectTextDOM(selectIt) {
        try {
            // get data
            var spData = spDataDOM.domContent || null;
            if (spData === null) return false;

            var tws = spData.textWords;
            if (tws === null) return false;
            if (tws.length === 0) return false;

            if (typeof selectIt === 'undefined') selectIt = true;

            // check if this is a call to reset the selection
            var dataContent = '';
            if (selectIt === false) {
                // build text
                dataContent = domBuildContent(spData, -1);
                // $(spDataDOM.domCtrl.$).html(domBuildContent(spData, -1));
            } else {
                // build text
                dataContent = domBuildContent(spData, spData.curTypoInd);
                //$(spDataDOM.domCtrl.$).html(domBuildContent(spData, spData.curTypoInd));
            }
            if (sectionPartObj.type == "CKEDITOR") {

                CKEDITOR.instances[sectionPartObj.editorName].setData(dataContent);
            } else if (sectionPartObj.type == "INLINECKEDITOR") {
                $("#section_" + sectionPartObj.sectionID).find("#" + sectionPartObj.editorName).html(dataContent);

            } else {
                $(spDataDOM.domCtrl.$).html(dataContent)
            }

            /* try {
                 sectionPartObj.scrollTo(0, $("#edr-sp-select"), sectionPartObj.id);
             } catch (e) {
                 logger('ERROR', 'scrollTo: ' + e.message);
             }*/

            // added a slight delay to make it work with our friendly (!!!) IE browser
            window.setTimeout(function () {
                try {
                    $("#btn_ignore").focus();
                    if (document.getElementById('edr-sp-select')) {
                        document.getElementById('edr-sp-select').scrollIntoView();
                    }
                } catch (sv) {
                    console.log('scrollIntoView: ' + sv.message);
                    //  logger('ERROR', 'scrollIntoView: ' + sv.message);
                }
            }, 50);

            return true;
        } catch (e) {
            logger('ERROR', 'selectTextDOM(): ' + e.message);
        }
    };

    /*
     * Takes user's dictionary file and puts entries into array userDict
     */
    EDRSpellChecker.prototype.buildUserDictionary = function () {
        var url = spellCheckDictionary;
        var data = {
            action: 'readall'
        };
        jQuery.ajax({
            url: url,
            data: data,
            dataType: 'json',
            error: function (req, status, err) {
                // return false;
            },
            crossDomain: false,
            cache: false,
            success: function (data) {
                for (i = 0; i < data.result.length; i++) {
                    userDict[i] = data.result[i];
                }
                logger('INFO', 'buildUserDictionary(): built dictionary of ' + userDict.length + ' words');
            },
            type: 'POST'
        });
    };

    /*
     * Takes the current word and adds it to the user's dictionary file
     */
    EDRSpellChecker.prototype.addToDictionary = function (newWord) {
        userDict.push(newWord.toLowerCase());
        logger('INFO', 'addToDictionary(): added \'' + newWord + '\' to array');
        var url = spellCheckDictionary;
        var data = {
            action: 'create',
            word: newWord
        };
        jQuery.ajax({
            url: url,
            data: data,
            dataType: 'json',
            error: function (req, status, err) {
                // return false;
            },
            crossDomain: false,
            cache: false,
            success: function (data) {
                logger('INFO', 'addToDictionary(): adding the word \'' + newWord + '\' to dictionary.');
            },
            type: 'POST'
        });
    };

    EDRSpellChecker.prototype.checkDictionary = function (word) {
        return userDict.indexOf(word.toLowerCase()) !== -1;
    };

    EDRSpellChecker.prototype.replaceCounter = function (reset) {
        if (reset) {
            return replaceCounter = 0;
        } else {
            return replaceCounter;
        }

    }

    /*
     * Check if word is valid based on internal dictionaries
     */
    function _isValidWord(word) {

        // verify argument
        word = word || '';
        if (word === '') return true;

        // convert to lowercase to easier check w/ dictionaries
        var key = word.toLowerCase();

        // ignore numbers
        if (key.match(/[0-9]+/) !== null) return true; // valid as long as there is one numeric value in the word (ex: Tst123)

        // ignore all caps
        if (word.match(/^[A-Z]+$/) !== null) return true;

        // ignore from user dictionary
        if (userDict.indexOf(key) !== -1) return true;

        // ignore if word has been spellchecked and valid or any other words
        // that are deemed to be valid (usually added in the constructor)
        if (validWords.indexOf(key) !== -1) return true;

        // find it if it is already ignored
        var isIgnoredWord = addOrCheckIgnoreWord(key, true, null);

        // if this word has been ignored ALL then we don't have to spellcheck
        if ((isIgnoredWord !== null) && (isIgnoredWord.ignoreAll === true)) return true;

        return false;
    };

    /*
     * Check if word is valid based on internal dictionaries
     */
    EDRSpellChecker.prototype.isValidWord = _isValidWord;

    /*
     * Logger
     *
     * @msgType: INFO, ERROR, WARNING, IGNORE, REPLACE
     * @message: message
     */
    function logger(msgType, message) {
        // try { console.log('EDRSPELL-' + msgType + ': ' + message); } catch (e) { }
    };

    // set class constructor
    EDRSpellChecker.prototype.constructor = EDRSpellChecker;

    // return our class definition
    return EDRSpellChecker;
})();
