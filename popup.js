function popup(viewer) {
    var removeHandler;
    var content;
    var scene = viewer.scene;
    var infoDiv = '<div id="trackPopUp" style="display:none;">'+
        '<div id="trackPopUpContent" class="leaflet-popup" style="top:5px;left:0;">'+
        '<a class="leaflet-popup-close-button" href="#">×</a>'+
        '<div class="leaflet-popup-content-wrapper">'+
        '<div id="trackPopUpLink" class="leaflet-popup-content" style="max-width: 300px;"></div>'+
        '</div>'+
        '<div class="leaflet-popup-tip-container">'+
        '<div class="leaflet-popup-tip"></div>'+
        '</div>'+
        '</div>'+
        '</div>';
    $("#cesiumContainer").append(infoDiv);
    var handler3D = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler3D.setInputAction(function(movement) {
        var pick = scene.pick(movement.position);
        if(pick && pick.id){
            console.log(pick.id);
            $('#trackPopUp').show();
            var id = Cesium.defaultValue(pick.id, pick.primitive.id);
            //显示的内容
            content ='<div style="height: 180px;width: 500px;background-color: #faf6fb" id="' + id._id + '">' + pick.id._id + '</div>';
            var obj = {position:movement.position,content:content};
            infoWindow(obj);
            function infoWindow(obj) {
                var picked = scene.pick(obj.position);
                if (Cesium.defined(picked)) {
                    var id = Cesium.defaultValue(picked.id, picked.primitive.id);
                    if (id instanceof Cesium.Entity) {
                        $(".cesium-selection-wrapper").show();
                        $('#trackPopUpLink').empty();
                        $('#trackPopUpLink').append(obj.content);
                        function positionPopUp (c) {
                            var x = c.x - ($('#trackPopUpContent').width()) / 2;
                            var y = c.y - ($('#trackPopUpContent').height());
                            $('#trackPopUpContent').css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
                        }
                        var c = new Cesium.Cartesian2(obj.position.x, obj.position.y);
                        $('#trackPopUp').show();
                        positionPopUp(c);
                        removeHandler = viewer.scene.postRender.addEventListener(function () {
                            if(picked.id._polyline!=null){
                                var pos={};
                                pos.x=(id._polyline._positions._value["0"].x+id._polyline._positions._value[1].x)/2;
                                pos.y=(id._polyline._positions._value["0"].y+id._polyline._positions._value[1].y)/2;
                                pos.z=(id._polyline._positions._value["0"].z+id._polyline._positions._value[1].z)/2;
                                var changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene,pos);
                            }else{
                                var changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, id._position._value);
                            }
                            if ((c.x !== changedC.x) || (c.y !== changedC.y)) {
                                positionPopUp(changedC);
                                c = changedC;
                            }
                        });
                        $('.leaflet-popup-close-button').click(function() {
                            $('#trackPopUp').hide();
                            $('#trackPopUpLink').empty();
                            $(".cesium-selection-wrapper").hide();
                            removeHandler.call();
                            return false;
                        });
                        return id;
                    }
                }
            }
        }
        else{
            $('#trackPopUp').hide();

        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
