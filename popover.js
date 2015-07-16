// 
// popover.js - copyright vitim.us
// created 24-jun-2013

function Popover(target, options){
    
    options.target=target;
    
    target.addEventListener((target.getAttribute('data-trigger')||options.trigger), function(e){
        
        if(!target.nextSibling || !target.nextSibling.classList || !target.nextSibling.classList.contains('popover')){
            
            //create popover
            var title=typeof options.title=='function'?options.title.call(options, target):(target.getAttribute('title') || options.title);
            var content=typeof options.content=='function'?options.content.call(options, target):(target.getAttribute('data-content') || options.content);
            
            options.popover = tag('div', {class: 'popover '+( target.getAttribute('data-placement') || options.placement )},
                              tag('h3', {class: 'title'}, title),
                              tag('div', {class: 'content'}, content)
                         );
            
            insertAfter(target, options.popover);
            placePopover(options.popover, target);
            dismissible(options.popover, {});
            e.stopPropagation();
        }
        
    });
	
	options.close=function(){
		this.popover.parentElement.removeChild(this.popover);	
	}
}

function insertAfter(parentGuest, childGuest){
    if (parentGuest.nextSibling) parentGuest.parentNode.insertBefore(childGuest, parentGuest.nextSibling);
    else parentGuest.parentNode.appendChild(childGuest);
}

function cumulativeOffset(element) {
	var top = 0, left = 0;
	if(element.parentNode) {
		do {
			top += element.offsetTop || 0;
			left += element.offsetLeft || 0;
			element = element.parentNode;
		} while (element);
	}
	return {left:left, top:top};
}

function placePopover(popover, target){
    
    //var pos = cumulativeOffset(target);
    var pos = {top: target.offsetTop, left:target.offsetLeft};
    
    //above target
    if(popover.classList.contains('above')){
        //popover.classList.add('above');
        popover.style.top = pos.top-popover.scrollHeight+"px";
        popover.style.left = (pos.left+(target.offsetWidth/2)) - (popover.clientWidth/2) +"px";
    }
    //below target
    if(popover.classList.contains('below')){
        //popover.classList.add('below');
        popover.style.top = pos.top+target.offsetHeight +"px";
        popover.style.left = (pos.left) - (popover.offsetWidth/2) +"px";
    }
    //right of target
    if(popover.classList.contains('right')){
        //popover.classList.add('right');
        popover.style.top = (pos.top+(target.offsetHeight/2)-16) +"px";
        popover.style.left = (pos.left+target.offsetWidth) +"px";
    }
    //left of target
    if(popover.classList.contains('left')){
        //popover.classList.add('left');
        popover.style.top = (pos.top+(target.offsetHeight/2)-16) +"px";
        popover.style.left = (pos.left-popover.scrollWidth) +"px";
    }
}

function dismissible(element, target){
    function dismissPopoverEvent(e){
        for (var elm=e.target; elm; elm=elm.parentNode){
            if(elm===element || elm===target){
                console.log('Clicked inside element do nothing.');
                return;
            }
        }
        console.log('Clicked outside, remove element and event listenter');
		document.removeEventListener("click", dismissPopoverEvent);
        if(element.parentElement) element.parentElement.removeChild(element);
        
    }
    document.addEventListener("click", dismissPopoverEvent);
    return dismissPopoverEvent;
}


//create element
function tag(tag, attributes, childs){
    function isArray(object) {
        return Object.prototype.toString.call(object) === "[object Array]";
    }
    function isElement(object) {
        return !!(object && object.nodeType == 1);
    }
    
	var element=document.createElement(tag);
	if(typeof attributes==='object' && attributes!=null){
		for(var attName in attributes){
			var attValue=attributes[attName];
			if(attName.toLowerCase()=='style'){	element.style.cssText=attValue;	}
			else if(attName.toLowerCase()=='class' || attName.toLowerCase()=='classname'){ element.className=attValue; }
			else{ element[attName] = attValue; }
		}
	}
	
    for(var i=2; i<arguments.length; i++)
        if(isElement(arguments[i]))
            element.appendChild(arguments[i]);
    
    if(isArray(childs))
        for(var i=0; i<childs.length; i++)
            if(isElement(childs[i]))
                element.appendChild(childs[i]);
    
    if(typeof childs=="string")
        element.innerHTML = childs;
    
	return element;
}

