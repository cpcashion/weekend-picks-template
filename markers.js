var picks = {};

picks.removed = []; // List of markers that have been removed from map (filtered)
picks.symbols = []; // List of all unique symbols
picks.selected = null;

picks.start = function(url) {

    // Create marker layer
    picks.layer = mmg().factory(simplestyle_factory).url(url, function(feat, l) {

        // Add interaction
        mmg_interaction(l);

        // Create a list of all unique marker symbols
        picks.symbols =  $.unique(
            $.map(picks.layer.markers(), function(m) {
                return m.data.properties['marker-symbol'];
            }));

        // Set up all button
        var all = $('#null');
        all.click(function() {
            if (picks.selected) {
                // Deselect other button
                $('#' + picks.selected).removeClass('selected');
                // Select all button
                all.addClass('selected');
                picks.selected = null;
                picks.show(picks.selected);
            }
        });

        // Create a symbol based filter
        var container = $('#markerfilters');
        $.each(picks.symbols, function(index, s) {

            var el = $(document.createElement('a'))
                .addClass('markerfilter')
                .attr('id', s)
                .css('background-image', 'url(http://a.tiles.mapbox.com/v3/marker/pin-l-'+s+'+000000.png)');

            el.click(function(a) {
                if (picks.selected == s) {
                    picks.selected = null;
                    $('#null').addClass('selected');
                    el.removeClass('selected');
                } else {
                    $('#' + picks.selected).removeClass('selected');
                    el.addClass('selected');
                    picks.selected = s;
                }
                picks.show(picks.selected);
                return false;
            });

            container.append(el);
        });

    });
    MM_map.addLayer(picks.layer);

}


// Set all markers with specified symbol to be shown
picks.show = function(s) {

    // re-add removed markers
    $.each(picks.removed, function(index, m) {
        picks.layer.add(m);
    });
    picks.removed = [];

    if (s) {
        // show markers in category
        picks.removed = $.grep(picks.layer.markers(), function(m) {
            return m.data.properties['marker-symbol'] != s;
        });
        
        $.each(picks.removed, function(index, m) {
            picks.layer.remove(m);
        });
    }
    picks.layer.draw();
}
