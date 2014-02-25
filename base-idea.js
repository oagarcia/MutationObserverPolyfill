        /**
         * THIS FUNCTION IS NOT THE FINAL POLYFILL... is just a simple function containing a base idea!!!!!!!!!
         * 
         * What's different here??? -> Intended ti support ALSO IE8
         *
         *
         * Register attribute changes in the DOM (yes... should be a plugin)
         * @author Andres Garcia oagarciar@gmail.com
         * @param  {HTMLElement} element DOM where the event/observer is tied
         * @param  {Function} callback Event to be fired once attibute is changed
         */
        function registerDOMEventChangeAttr(element, callback){
            var div = document.createElement('div'),
                MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
                DOMAttrModifiedSupport,
                onPropertyChangeSupport;
                
            //IE9, FF
            if(div.addEventListener){
                div.addEventListener('DOMNodeInserted', function(){ DOMAttrModifiedSupport = true; });
                div.appendChild(div.cloneNode(true));
            }
            
            //Old IE (8-)
            onPropertyChangeSupport = typeof div.onpropertychange === 'object';

            //Great browsers
            if(MutationObserver){
                var observer = new MutationObserver(function( mutations ) {
                    if(mutations[0].type === 'attributes'){
                        callback.call(element);
                        //observer.disconnect();
                    }
                });

            observer.observe(element, { attributes: true, childList: true, characterData: true });
            }else if(DOMAttrModifiedSupport){
                element.addEventListener('DOMAttrModified', function (event) {
                    //console.log('done in DOMAttrModified');
                    callback.call(element);
                }, false);
            }else if(onPropertyChangeSupport){
                if(element.attachEvent){
                    element.attachEvent('onpropertychange', function (event) {
                        callback.call(element);
                    });
                }else{
                    element.onpropertychange = function () {
                        callback.call(element);
                    };
                }
            }else{
                //I'm in problems... no DOM events supported at all! Set interval???... However I don't need to support tooooo old browsers.
            }
        }
