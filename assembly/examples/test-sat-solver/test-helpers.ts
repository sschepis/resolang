// Test result tracking for comprehensive validation
export class TestResult {
    test_name: string;
    passed: boolean;
    execution_time: f64;
    error_message: string;
    expected_value: f64;
    actual_value: f64;
    tolerance: f64;
    
    constructor(name: string) {
        this.test_name = name;
        this.passed = false;
        this.execution_time = 0.0;
        this.error_message = "";
        this.expected_value = 0.0;
        this.actual_value = 0.0;
        this.tolerance = 1e-6;
    }
}