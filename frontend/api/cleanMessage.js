export const cleanMessage = function(message){

    // might not be ideal, haven't thought through all the edge cases such as the body of the message actually wanting to display the text '<link>'
    if(message.includes('<link')){
        message = message.replace('<link', '<a');

    } else if (message.includes('</link>')){
        message = message.replace('<link', '</a>');

    } else if(message.includes('<body')){
        message = message.replace('<body', '<bodyGPT');

    } else if(message.includes('</body>')){
        message = message.replace('</body>', '</bodyGPT>');
    }

    return message;
}