from enum import Enum


class PayFrequency(int, Enum):
    SPECIAL_CONTRIBUTION = 0
    MONTHLY = 1
    QUARTERLY = 3
    ANNUALLY = 12


class Month(int, Enum):
    JANUARY = 0
    FEBRUARY = 1
    MARCH = 2
    APRIL = 3
    MAY = 4
    JUNE = 5
    JULY = 6
    AUGUST = 7
    SEPTEMBER = 8
    OCTOBER = 9
    NOVEMBER = 10
    DECEMBER = 11
