/**
 * This constructor function is not a Polyfill!!! Is just a base idea of the future polyfill
 * Register attribute changes in the DOM
 * @author Andres Garcia, Zemoga Inc https://github.com/oagarcia/MutationObserverPolyfill
 * @param  {HTMLElement} element DOM where the event/observer is tied
 * @param  {Function} callback Event to be fired once attibute is 
 * @constructor
 */
sen.MutationObserverChangedAttr = function(element, callback){
    var div = document.createElement('div');

        this.propertyChangeCallback = function(){
            callback.call(element);
        };

        this.MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        this.DOMAttrModifiedSupport = null;
        this.onPropertyChangeSupport = null;
        this.observer = null;

        
        
    //IE9, FF
    if(div.addEventListener){
        div.addEventListener('DOMNodeInserted', function(){ this.DOMAttrModifiedSupport = true; });
        div.appendChild(div.cloneNode(true));
    }
    
    //Old IE (8-)
    onPropertyChangeSupport = typeof div.onpropertychange === 'object';


    //Great browsers
    if(this.MutationObserver){
        var MutationObserverChangedAttrInstance = this;
        this.observer = new this.MutationObserver(function( mutations ) {
            if(mutations[0].type === 'attributes'){
                MutationObserverChangedAttrInstance.propertyChangeCallback();
            }
        });
        this.observer.observe(element, { attributes: true, childList: true, characterData: true });

    //IE9, FF 
    }else if(this.DOMAttrModifiedSupport){
        element.addEventListener('DOMAttrModified', this.propertyChangeCallback, false);

    //Old IE (8-)
    }else if(this.onPropertyChangeSupport){
        if(element.attachEvent){
            element.attachEvent('onpropertychange', this.propertyChangeCallback);
        }else{
            element.onpropertychange = this.propertyChangeCallback;
        }
    }else{
        //I'm in problems... no DOM events supported at all! Set interval???... However I don't need to support tooooo old browsers.
    }

    element.MutationObserverInstance = this;
};

/**
 * Removes already assigned RegisterMutationObserverChangedAttr
 * @param  {HTMLElement} element DOM element with observer assigned
 */
sen.removeMutationObserverChangedAttr = function (element){
    var obs = element.MutationObserverInstance;
    if(obs){
        if(obs.observer){
            obs.observer.disconnect();
        }else if(obs.DOMAttrModifiedSupport){
            element.removeEventListener('DOMAttrModified', obs.propertyChangeCallback, false);
        }else if(obs.onPropertyChangeSupport){
            if(element.attachEvent){
                element.detachEvent('onpropertychange', obs.propertyChangeCallback);
            }else{
                element.onpropertychange = null;
            }
            
        }else{
            //I'm in problems... no DOM events supported at all! Set interval???... However I don't need to support tooooo old browsers.
        }
    }
    element.MutationObserverInstance = undefined;
};
