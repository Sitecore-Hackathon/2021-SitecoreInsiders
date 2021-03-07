var FitCropper = (function () {

    /**
     *  Initialize modal
     */
    const modalEl = $xa(".modal.alert-fitcropper");

    modalEl.find('#executeFitcropper').on('click', function () {
        validateFitCropper($xa(this).attr('data-val'));
    });

    const validateFitCropper = function (context) {
        modalEl.modal("hide")
        window.FitCropper.applySize(context);
    };

    const openModalFitCropper = function (context) {
        if (modalEl.length > 0) {
            modalEl.modal({
                backdrop: 'static',
                keyboard: false
            });
            $xa('#executeFitcropper').attr('data-val', context);
        }
    };


    const transformGuid = function (fieldIdentifier) {
        return fieldIdentifier.replace(/[{}-]/g, '');
    };

    const GetItemUriObject = function (uri) {
        const idAndLangVersion = uri.split("/")[uri.split("/").length - 1].split("?");
        const langAndVersion = idAndLangVersion[1].split("&amp;").join(',').split(/[,=]/);

        return {
            id: transformGuid(idAndLangVersion[0]),
            language: langAndVersion[1],
            version: langAndVersion[3]
        }
    };

    const GetSelectedImageFields = function (selectedChrome) {
        var targets = [];
        var childs = selectedChrome.getChildChromes();

        if (childs.length) {
            targets = childs.map(child => GetSelectedImageFields(child)).filter(x => x.length).flat();
        } else if (selectedChrome.element[0].tagName == "IMG") {
            targets.push({
                fieldId: selectedChrome.fieldIdentifier,
                controlId: selectedChrome.type.fieldValue[0].id,
                originalElement: selectedChrome.element[0],
                itemUri: GetItemUriObject(selectedChrome.data.contextItemUri),
                reference: selectedChrome
            });
        }

        return targets;
    };

    const GetImageFitSize = function (element) {
        return {
            width: element[0].width - 100,
            height: element[0].height - 100
        }
    };

    const applySizeToField = function (fieldInfo) {

        FitCropperImgSize(fieldInfo.originalElement, (result) => callBackend(fieldInfo, result))
    };

    const applySize = function (type) {
        var targets;
        if (type != 'global') {
            var selected = Sitecore.PageModes.ChromeManager.selectedChrome();
            targets = selected ? GetSelectedImageFields(selected) : [];
        } else {
            targets = Sitecore.PageModes.ChromeManager.chromes().map(child => GetSelectedImageFields(child)).filter(x => x.length).flat();
            targets = targets.filter((value, idx, arr) => arr.findIndex(x => x.controlId == value.controlId) == idx);
        }

        targets.forEach(x => applySizeToField(x));
    }


    const callBackend = function (fieldInfo, newSize) {
        fieldInfo.reference._originalDOMElement.context.setAttribute("sc_parameters", newSize.width + "|" + newSize.height);
        var params = new Object();
        params.itemId = fieldInfo.itemUri.itemId;
        params.language = fieldInfo.itemUri.language;
        params.version = fieldInfo.itemUri.version;
        params.fieldId = fieldInfo.fieldId;
        params.controlId = fieldInfo.controlId;
        params.command = "fitcropper:applysizeselected";
        Sitecore.PageModes.ChromeManager.handleMessage("chrome:field:editcontrol", params)
    };



    function ImageUrlCleanUp(imageComponent) {

        var imageUrl = imageComponent.getAttribute("src");

        if (imageUrl.includes("w=") || imageUrl.includes("h=")) {
            var imageUrlValue = imageUrl.split("?")[0];

            var querystring = imageUrl.split("?")[1];

            if (querystring != null || querystring != undefined) {
                var urlProperties = querystring.split("&");
                var imageSrc = imageUrlValue + "?" + urlProperties.filter(e => !e.startsWith("w")).filter(c => !c.startsWith("h"));
                imageComponent.setAttribute("src", imageSrc);
            }
        }
    }

    function ImageAttrRemoval(imageComponent) {
        imageComponent.setAttribute("width", "");
        imageComponent.setAttribute("height", "");
    }

    function ImageScaleUp(imageComponent) {

        if (getComputedStyle(imageComponent).maxHeight == "100%") {
            imageComponent.style.height = '100%';
            return "height";
        }

        imageComponent.style.width = '100%';
        return "width";
    }

    function ImageScaleRetractor(imageComponent) {
        imageComponent.style.width = '';
        imageComponent.style.height = '';
    }

    function GetImageSize(attribute, imageComponent) {
        return {
            width: imageComponent.width,
            height: imageComponent.height
        };
    }

    function GetMinimumSize(attribute, beforeCleanUpValue, afterScaleUpValue) {

        console.log("GetMinimumSize - beforeCleanUpValue: ", beforeCleanUpValue);
        console.log("GetMinimumSize - afterScaleUpValue: ", afterScaleUpValue);

        return beforeCleanUpValue[attribute] < afterScaleUpValue[attribute] ? beforeCleanUpValue : afterScaleUpValue;
    }

    function FitCropperImgSize(imageComponent, callback) {
        ImageUrlCleanUp(imageComponent);

        ImageAttrRemoval(imageComponent);

        setTimeout(function () {

                var beforeCleanUpValue = GetImageSize(attr, imageComponent);

                console.log("beforeCleanUpValue: ", beforeCleanUpValue);

                var attr = ImageScaleUp(imageComponent);

                var promise = new Promise(function (resolve, reject) {

                    setTimeout(function () {
                        var afterScaleUpValue = GetImageSize(attr, imageComponent);

                        console.log("afterScaleUpValue: ", afterScaleUpValue);

                        var newSize = GetMinimumSize(attr, beforeCleanUpValue, afterScaleUpValue);

                        ImageScaleRetractor(imageComponent);

                        resolve({
                            newSize
                        });

                    }, 500);
                }).then(function (result) {
                    callback(result);
                });

            },
            800);
    }

    return {
        GetItemUriObject,
        GetSelectedImageFields,
        GetImageFitSize,
        applySize,
        openModalFitCropper
    }

})();

window.FitCropper = FitCropper;




/*

var FitCropper = {
	GetImageFitSize: function (){ console.log('GetImageFitSize')},
	ApplySize: function(){console.log('ApplySize')}
}
*/