angular.module('ResetPasswordModule').constant('resetPasswordMessages',{
    
    INVALID_USER : 'You have enetered an email address that we could not locate. Please try again',
    EMAIL_VALIDATION_SUCCESS : 'Your username and details about how to reset your password have been sent to you by email.',
    ERROR : 'Server encountered an error',
    RESETPASSWORD_SUCCESS : 'Your password was reset successfully. Please wait while you are being redirected...',
    INVALIDTOKEN : 'Invalid Token'
})