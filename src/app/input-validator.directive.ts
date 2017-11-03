/*
* Validates input elements with: requred, number, email and regex options
* regex syntax: regex:pattern
* to combine validator options use | example: requred|number
* */

import {Directive, ElementRef, Input, OnChanges, OnInit} from '@angular/core';

@Directive({
    selector: '[appInputValidator]'
})
export class InputValidatorDirective implements OnInit {
    validatorOptions: string[];
    value: string;
    validationPassed = true;
    validatorRegex: string;

    @Input('appInputValidator') set appInputValidator(args: string) {
       this.validatorOptions = args.split('|');
       this.validatorRegex = this.validatorOptions.find(e => e.includes('regex:'));
       this.validate();
    }

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        this.value = this.el.nativeElement.value;

        this.el.nativeElement.addEventListener('input', (e) => {
            this.value = this.el.nativeElement.value;
            this.validate();
        });
    }

    validate() {

        this.validationPassed = true;

        if (this.validatorOptions.includes('required')) {
            if (this.value === '') {
                this.validationPassed = false;
            }
        }
        if (this.validatorOptions.includes('number')) {
            if (!this.isNumber(this.value)) {
                this.validationPassed = false;
            }
        }
        if (this.validatorOptions.includes('email')) {
            if (!this.validateEmail(this.value)) {
                this.validationPassed = false;
            }
        }
        if (typeof this.validatorRegex !== 'undefined') {
            const regexExpression = this.validatorRegex.split('regex:')[1];
            const pattern = new RegExp(regexExpression);
            if (!pattern.test(this.value)) {
                this.validationPassed = false;
            }
        }
         this.validationPassed ? this.onValidatePass() : this.onValidateFail();
    }

    isNumber(n) {
        const res = parseInt(n, 10);
        return isNaN(res) ? null : res;
    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    onValidateFail() {
        this.el.nativeElement.style.backgroundColor = 'red';
    }

    onValidatePass() {
        this.el.nativeElement.style.backgroundColor = 'transparent';
    }

}