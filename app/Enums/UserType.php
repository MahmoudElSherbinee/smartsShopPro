<?php

namespace App\Enums;

enum UserType: string
{
    case CUSTOMER = 'customer';
    case VENDOR = 'vendor';
    case ADMIN = 'admin';

    public static function values() : array {
        return array_column(self::cases(), 'value');
    }
}
