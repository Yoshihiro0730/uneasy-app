<?php
function getTimeColumn($hour) {
    $hour_int = intval($hour);
    if ($hour_int >= 9 && $hour_int < 18) {
        return 'T_' . ($hour_int - 8);
    }
    return null;
}

function isValidReservationTime($hour) {
    $hour_int = intval($hour);
    return $hour_int >= 9 && $hour_int < 18;
}